-- ================================================
-- SOUTHERN PETS ANIMAL RESCUE - TNR REQUEST SYSTEM
-- Production-Ready Schema with Enhanced Security & Performance
-- ================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Prefer pgcrypto if available for gen_random_uuid
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- Core tables
-- =========================
CREATE TABLE IF NOT EXISTS tnr_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), -- or gen_random_uuid()
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Contact
  requester_name varchar(255) NOT NULL,
  requester_email varchar(255) NOT NULL,
  requester_phone varchar(32) NOT NULL,

  -- Address
  street_address varchar(500) NOT NULL,
  city varchar(100) NOT NULL DEFAULT 'Acadia Parish',
  state char(2) NOT NULL DEFAULT 'LA',
  zip_code varchar(10) NOT NULL,

  -- Colony
  estimated_cat_count integer NOT NULL CHECK (estimated_cat_count >= 0),
  colony_location_description text,
  feeding_schedule varchar(255),

  -- Cat Details
  cats_friendly boolean NOT NULL DEFAULT false,
  cats_have_shelter boolean NOT NULL DEFAULT false,
  previous_tnr boolean NOT NULL DEFAULT false,

  -- Additional
  special_circumstances text,
  preferred_contact_method varchar(50) NOT NULL DEFAULT 'email'
    CHECK (preferred_contact_method IN ('email','phone','text')),
  preferred_appointment_time varchar(100),

  -- Status/assignment
  status varchar(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','review','scheduled','completed','cancelled')),
  assigned_to varchar(255),
  notes text,

  -- Metadata
  ip_address inet,
  user_agent text,

  -- Basic format checks (non-strict; keep user-friendly)
  CONSTRAINT email_has_at CHECK (position('@' in requester_email) > 1),
  CONSTRAINT phone_not_empty CHECK (length(trim(requester_phone)) > 0),
  CONSTRAINT zip_basic CHECK (zip_code ~ '^[0-9]{5}(-[0-9]{4})?$')
);

CREATE TABLE IF NOT EXISTS submission_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),

  request_id uuid REFERENCES tnr_requests(id) ON DELETE CASCADE,

  form_type varchar(50) NOT NULL DEFAULT 'tnr-request',
  submission_status varchar(50) NOT NULL
    CHECK (submission_status IN ('success','failed','pending')),
  submission_error text,

  admin_email_sent boolean NOT NULL DEFAULT false,
  admin_email_id varchar(255),
  admin_email_error text,

  user_email_sent boolean NOT NULL DEFAULT false,
  user_email_id varchar(255),
  user_email_error text,

  admin_responded boolean NOT NULL DEFAULT false,
  admin_responded_at timestamptz,
  response_method varchar(50) CHECK (response_method IS NULL OR response_method IN ('email','phone','text')),

  ip_address inet,
  user_agent text,
  referrer text,

  developer_notes text
);

-- =========================
-- Indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_tnr_requests_created_at ON tnr_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tnr_requests_status ON tnr_requests(status);
CREATE INDEX IF NOT EXISTS idx_tnr_requests_email ON tnr_requests(requester_email);
CREATE INDEX IF NOT EXISTS idx_tnr_requests_zip ON tnr_requests(zip_code);
CREATE INDEX IF NOT EXISTS idx_tnr_requests_assigned_to ON tnr_requests(assigned_to);

CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON submission_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_request_id ON submission_analytics(request_id);
CREATE INDEX IF NOT EXISTS idx_analytics_form_type ON submission_analytics(form_type);
CREATE INDEX IF NOT EXISTS idx_analytics_status ON submission_analytics(submission_status);
CREATE INDEX IF NOT EXISTS idx_analytics_admin_responded ON submission_analytics(admin_responded);

-- Helpful partial indexes for common filters
CREATE INDEX IF NOT EXISTS idx_tnr_requests_pending ON tnr_requests(id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_analytics_needs_email ON submission_analytics(id) WHERE submission_status = 'success' AND (NOT admin_email_sent OR NOT user_email_sent);

-- =========================
-- RLS
-- =========================
ALTER TABLE tnr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_analytics ENABLE ROW LEVEL SECURITY;

-- Public can submit (insert only)
DROP POLICY IF EXISTS "Allow public insert" ON tnr_requests;
CREATE POLICY "Allow public insert"
  ON tnr_requests FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated can read and update all (adjust if you want per-user scoping)
DROP POLICY IF EXISTS "Allow authenticated read" ON tnr_requests;
CREATE POLICY "Allow authenticated read"
  ON tnr_requests FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON tnr_requests;
CREATE POLICY "Allow authenticated update"
  ON tnr_requests FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Analytics: allow public insert for logging only
DROP POLICY IF EXISTS "Allow public insert analytics" ON submission_analytics;
CREATE POLICY "Allow public insert analytics"
  ON submission_analytics FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read analytics" ON submission_analytics;
CREATE POLICY "Allow authenticated read analytics"
  ON submission_analytics FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated update analytics" ON submission_analytics;
CREATE POLICY "Allow authenticated update analytics"
  ON submission_analytics FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- =========================
-- Triggers and functions
-- =========================

-- updated_at maintenance
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_tnr_requests_updated_at ON tnr_requests;
CREATE TRIGGER update_tnr_requests_updated_at
BEFORE UPDATE ON tnr_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Analytics auto-create on request insert
CREATE OR REPLACE FUNCTION create_submission_analytics()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO submission_analytics (
    request_id, form_type, submission_status, ip_address, user_agent
  ) VALUES (
    NEW.id, 'tnr-request', 'pending', NEW.ip_address, NEW.user_agent
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION create_submission_analytics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_submission_analytics() TO anon, authenticated;

DROP TRIGGER IF EXISTS create_analytics_on_request ON tnr_requests;
CREATE TRIGGER create_analytics_on_request
AFTER INSERT ON tnr_requests
FOR EACH ROW EXECUTE FUNCTION create_submission_analytics();

-- =========================
-- Views
-- =========================
CREATE OR REPLACE VIEW submission_summary
AS
SELECT
  date(created_at) AS submission_date,
  form_type,
  COUNT(*) AS total_submissions,
  COUNT(*) FILTER (WHERE submission_status = 'success') AS successful_submissions,
  COUNT(*) FILTER (WHERE submission_status = 'failed') AS failed_submissions,
  COUNT(*) FILTER (WHERE admin_email_sent) AS admin_emails_sent,
  COUNT(*) FILTER (WHERE user_email_sent) AS user_emails_sent,
  COUNT(*) FILTER (WHERE admin_responded) AS admin_responses
FROM submission_analytics
GROUP BY 1, 2
ORDER BY submission_date DESC;

CREATE OR REPLACE VIEW recent_submissions_status
AS
SELECT
  sa.id,
  sa.created_at,
  sa.form_type,
  sa.submission_status,
  sa.admin_email_sent,
  sa.user_email_sent,
  sa.admin_responded,
  sa.admin_responded_at,
  sa.response_method,
  tr.status AS request_status,
  tr.estimated_cat_count,
  tr.city,
  tr.zip_code
FROM submission_analytics sa
LEFT JOIN tnr_requests tr ON sa.request_id = tr.id
ORDER BY sa.created_at DESC
LIMIT 100;

-- =========================
-- Grants
-- =========================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON tnr_requests TO authenticated;
GRANT INSERT ON tnr_requests TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON submission_analytics TO authenticated;
GRANT INSERT ON submission_analytics TO anon;

GRANT SELECT ON submission_summary TO authenticated;
GRANT SELECT ON recent_submissions_status TO authenticated;
