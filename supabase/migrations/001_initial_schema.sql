-- Southern Pets Animal Rescue Database Schema

-- Enable UUID extension for generating IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TNR Request Form
CREATE TABLE IF NOT EXISTS tnr_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Cat Questions
  how_many_cats TEXT NOT NULL,
  any_injured_or_sick TEXT NOT NULL,
  how_long_had_them TEXT,
  are_they_fixed TEXT,
  additional_information TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tnr_requests_created_at ON tnr_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tnr_requests_email ON tnr_requests(email);

-- Adoption Application Form
CREATE TABLE IF NOT EXISTS adoption_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Personal Information
  pet_interested TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birthday TIMESTAMPTZ,
  employer_info TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Housing and Living Arrangements
  address TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  own_or_rent TEXT NOT NULL,
  yard_fenced TEXT NOT NULL,
  pets_allowed TEXT NOT NULL,
  how_long_at_address TEXT NOT NULL,
  animal_primary_location TEXT NOT NULL,
  if_move_pets_not_allowed TEXT NOT NULL,
  adults_and_children_count TEXT NOT NULL,
  children_ages TEXT,
  hours_alone_per_day TEXT NOT NULL,
  who_responsible TEXT NOT NULL,
  everyone_committed TEXT NOT NULL,
  anyone_allergies TEXT NOT NULL,
  animal_role TEXT NOT NULL,
  activity_level TEXT NOT NULL,

  -- Animal Behavior and Cost
  handle_potty_accidents TEXT NOT NULL,
  behaviors_not_tolerate TEXT NOT NULL,
  handle_behavior_issues TEXT NOT NULL,
  monthly_preventatives_budget TEXT NOT NULL,
  annual_vet_budget TEXT NOT NULL,
  ever_taken_to_shelter TEXT NOT NULL,
  ever_applied_to_adopt TEXT NOT NULL,
  application_approved TEXT,

  -- Animal History and Care
  how_many_pets_in_life TEXT NOT NULL,
  lost_pet_in_last5_years TEXT NOT NULL,
  current_pets TEXT NOT NULL,
  current_pets_list TEXT,
  pets_housebroken TEXT,
  pets_spayed_neutered TEXT,
  pets_vaccines_up_to_date TEXT,
  where_pets_live TEXT,
  heartworm_preventative TEXT,
  vet_info TEXT,

  -- Signatures and Agreement
  certification_signature TEXT NOT NULL,
  agreement_signature TEXT NOT NULL,
  spay_neuter_initial TEXT,
  vaccine_series_initial TEXT,
  reference_check_initial TEXT,
  mistreatment_initial TEXT NOT NULL,

  -- Payment
  payment_method TEXT NOT NULL,
  additional_donation TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_adoption_applications_created_at ON adoption_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_email ON adoption_applications(email);

-- Contact Form
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Surrender Request Form
CREATE TABLE IF NOT EXISTS surrender_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Owner Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,

  -- Animal Info
  animal_name TEXT NOT NULL,
  animal_type TEXT NOT NULL,
  breed TEXT,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  spayed_neutered TEXT NOT NULL,
  vaccinated TEXT NOT NULL,
  reason TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_surrender_requests_created_at ON surrender_requests(created_at DESC);

-- Foster Application Form
CREATE TABLE IF NOT EXISTS foster_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,

  -- Housing
  own_or_rent TEXT NOT NULL,
  landlord_permission TEXT,
  yard_fenced TEXT NOT NULL,
  other_pets TEXT NOT NULL,
  other_pets_details TEXT,
  experience TEXT NOT NULL,
  availability TEXT NOT NULL,
  preferred_animal_type TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_foster_applications_created_at ON foster_applications(created_at DESC);

-- Volunteer Signup Form
CREATE TABLE IF NOT EXISTS volunteer_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  availability TEXT NOT NULL,
  interests TEXT NOT NULL,
  experience TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT
);

CREATE INDEX IF NOT EXISTS idx_volunteer_signups_created_at ON volunteer_signups(created_at DESC);

-- Donate Pledge Form
CREATE TABLE IF NOT EXISTS donate_pledges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  amount TEXT NOT NULL,
  frequency TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  anonymous BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_donate_pledges_created_at ON donate_pledges(created_at DESC);

-- Animal Listings (for Adopt page)
CREATE TABLE IF NOT EXISTS animals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name TEXT NOT NULL,
  type TEXT NOT NULL, -- "dog" or "cat"
  breed TEXT,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,

  -- Health info
  spayed_neutered BOOLEAN NOT NULL DEFAULT FALSE,
  vaccinated BOOLEAN NOT NULL DEFAULT FALSE,
  microchipped BOOLEAN NOT NULL DEFAULT FALSE,
  heartworm_status TEXT, -- "negative", "positive", "unknown"
  health_notes TEXT,

  -- Special flags
  special_note TEXT, -- "Very shy", "Heartworm positive", etc.
  foster_to_adopt BOOLEAN NOT NULL DEFAULT FALSE,
  available_for_reservation BOOLEAN NOT NULL DEFAULT FALSE,

  status TEXT NOT NULL DEFAULT 'available' -- "available", "pending", "adopted"
);

CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);
CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_tnr_requests_updated_at BEFORE UPDATE ON tnr_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_adoption_applications_updated_at BEFORE UPDATE ON adoption_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_surrender_requests_updated_at BEFORE UPDATE ON surrender_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_foster_applications_updated_at BEFORE UPDATE ON foster_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_signups_updated_at BEFORE UPDATE ON volunteer_signups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donate_pledges_updated_at BEFORE UPDATE ON donate_pledges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON animals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
