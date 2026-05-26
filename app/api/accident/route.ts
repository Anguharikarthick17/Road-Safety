import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      // Body parse fail
    }

    const { searchParams } = new URL(req.url);
    const status = body.status ?? searchParams.get('status') ?? 'ACCIDENT';
    const location = body.location ?? searchParams.get('location') ?? 'Chennai Highway';
    const severity = body.severity ?? searchParams.get('severity') ?? 'HIGH';

    // Insert into 'accidents' table
    const { data: accident, error: accError } = await supabase
      .from('accidents')
      .insert([
        {
          status: status,
          location: location,
          severity: severity,
          time: new Date().toISOString(),
          ambulance: null,
          police: null,
          fireforce: null,
          resolved: false
        }
      ])
      .select()
      .single();

    if (accError) {
      console.error('Error inserting accident via API:', accError);
      return NextResponse.json({ error: 'Failed to insert accident', details: accError }, { status: 500 });
    }

    // Also push a notification if table exists
    try {
      await supabase.from('notifications').insert([
        {
          msg: `🚨 accident detected by SAFETY AI at ${location} (${severity} severity)`,
          type: 'alert'
        }
      ]).then();
    } catch (notifErr) {
      console.warn('Failed to insert warning notification:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Accident successfully registered in Safety AI',
      data: accident
    });

  } catch (err: any) {
    console.error('Safety AI Accident API error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}

// Support GET requests for easy browser or GET-only IoT modules simulation testing
export async function GET(req: NextRequest) {
  return POST(req);
}
