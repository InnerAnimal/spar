import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// This route is for developer analytics only
// No sensitive data (emails, names, addresses) is returned

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const formType = searchParams.get('form_type') || 'tnr-request';

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get summary statistics (no sensitive data)
    const { data: summary, error: summaryError } = await supabase
      .from('submission_summary')
      .select('*')
      .eq('form_type', formType)
      .gte('submission_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('submission_date', { ascending: false });

    if (summaryError) throw summaryError;

    // Get recent submissions status (no sensitive data)
    const { data: recent, error: recentError } = await supabase
      .from('recent_submissions_status')
      .select('*')
      .eq('form_type', formType)
      .order('created_at', { ascending: false })
      .limit(50);

    if (recentError) throw recentError;

    // Get issues needing attention
    const { data: issues, error: issuesError } = await supabase
      .from('submission_analytics')
      .select('id, created_at, form_type, submission_status, admin_email_sent, user_email_sent, admin_email_error, user_email_error')
      .eq('form_type', formType)
      .or('submission_status.eq.failed,admin_email_sent.eq.false,user_email_sent.eq.false')
      .order('created_at', { ascending: false })
      .limit(20);

    if (issuesError) throw issuesError;

    // Calculate totals
    const totalSubmissions = summary?.reduce((sum, row) => sum + (row.total_submissions || 0), 0) || 0;
    const successfulSubmissions = summary?.reduce((sum, row) => sum + (row.successful_submissions || 0), 0) || 0;
    const failedSubmissions = summary?.reduce((sum, row) => sum + (row.failed_submissions || 0), 0) || 0;
    const adminEmailsSent = summary?.reduce((sum, row) => sum + (row.admin_emails_sent || 0), 0) || 0;
    const userEmailsSent = summary?.reduce((sum, row) => sum + (row.user_emails_sent || 0), 0) || 0;
    const adminResponses = summary?.reduce((sum, row) => sum + (row.admin_responses || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      period: `${days} days`,
      form_type: formType,
      totals: {
        total_submissions: totalSubmissions,
        successful_submissions: successfulSubmissions,
        failed_submissions: failedSubmissions,
        admin_emails_sent: adminEmailsSent,
        user_emails_sent: userEmailsSent,
        admin_responses: adminResponses,
        response_rate: totalSubmissions > 0 ? ((adminResponses / totalSubmissions) * 100).toFixed(1) + '%' : '0%',
        email_success_rate: totalSubmissions > 0 ? (((adminEmailsSent + userEmailsSent) / (totalSubmissions * 2)) * 100).toFixed(1) + '%' : '0%',
      },
      daily_summary: summary || [],
      recent_submissions: recent || [],
      issues_needing_attention: issues || [],
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

