import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Standard sensor thresholds for crash detection
const CRITICAL_SOUND_DB = 85.0;      // Sound level (dB) indicating impact
const CRITICAL_VIBRATION_G = 2.5;    // Vibration (g-force) indicating impact

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    
    // Parse request body if JSON is sent
    try {
      body = await req.json();
    } catch (e) {
      // Body is not JSON or is empty, fallback to search parameters below
    }

    const { searchParams } = new URL(req.url);

    // Extract values from JSON body or fallback to URL query parameters
    const sound = parseFloat(body.sound ?? searchParams.get('sound') ?? '0');
    const vibration = parseFloat(body.vibration ?? searchParams.get('vibration') ?? '0');
    const lat = parseFloat(body.lat ?? searchParams.get('lat') ?? '12.97');
    const lng = parseFloat(body.lng ?? searchParams.get('lng') ?? '79.99');
    const location = body.location ?? searchParams.get('location') ?? 'NH-44, Sriperumbudur';
    const vehicle = body.vehicle ?? searchParams.get('vehicle') ?? 'Crash Sensor Detected';

    // Verify if it qualifies as an emergency based on thresholds
    const isCritical = sound >= CRITICAL_SOUND_DB || vibration >= CRITICAL_VIBRATION_G;
    const isMedium = sound >= 70.0 || vibration >= 1.5;
    
    const severity = isCritical ? 'critical' : isMedium ? 'medium' : 'low';
    const incidentType = isCritical ? 'High-Impact Crash (Sensor)' : 'Breakdown (Sensor)';
    const victims = isCritical ? 1 : 0;

    // 1. Insert into 'incidents' table
    const { data: incident, error: incError } = await supabase
      .from('incidents')
      .insert([
        {
          type: incidentType,
          name: 'Hardware Sensor IoT',
          mobile: 'SYSTEM-ALERT',
          vehicle: vehicle,
          location: location,
          lat: lat,
          lng: lng,
          severity: severity,
          status: 'pending',
          victims: victims
        }
      ])
      .select()
      .single();

    if (incError) {
      console.error('Error inserting incident via API:', incError);
      return NextResponse.json({ error: 'Failed to insert incident', details: incError }, { status: 500 });
    }

    // 2. Insert into 'notifications' table
    const notifMsg = `Sensor Alert: ${incidentType} detected at ${location}!`;
    const { error: notifError } = await supabase
      .from('notifications')
      .insert([
        {
          msg: notifMsg,
          type: isCritical ? 'alert' : 'dispatch'
        }
      ]);

    if (notifError) {
      console.error('Error inserting notification via API:', notifError);
    }

    // 3. Insert into 'ai_alerts' table
    const aiMsg = `Hardware Trigger: Sound (${sound} dB) & Vibration (${vibration} g) detected at ${location}.`;
    const { error: aiError } = await supabase
      .from('ai_alerts')
      .insert([
        {
          msg: aiMsg,
          severity: severity
        }
      ]);

    if (aiError) {
      console.error('Error inserting AI alert via API:', aiError);
    }

    return NextResponse.json({
      success: true,
      message: 'Sensor data logged, alert generated',
      severity,
      sound,
      vibration,
      incident
    });

  } catch (err: any) {
    console.error('Sensor API error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}

// Support GET requests as fallback for simple hardware modules that cannot issue POST requests
export async function GET(req: NextRequest) {
  return POST(req);
}
