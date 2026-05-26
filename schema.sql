-- Drops if exist
DROP TABLE IF EXISTS public.incidents CASCADE;
DROP TABLE IF EXISTS public.shops CASCADE;
DROP TABLE IF EXISTS public.ai_alerts CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.hotspots CASCADE;

-- 1. Create Incidents Table
CREATE TABLE public.incidents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  name text,
  mobile text,
  vehicle text,
  location text,
  lat double precision,
  lng double precision,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'critical')),
  victims integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in-progress', 'resolved')),
  assigned text,
  eta text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Seed Incidents
INSERT INTO public.incidents (id, type, location, lat, lng, severity, victims, status, vehicle, assigned, eta, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'High-Speed Collision', 'NH-44, Sriperumbudur', 12.97, 79.99, 'critical', 3, 'pending', 'Car vs Truck', NULL, NULL, now() - interval '2 minutes'),
  ('22222222-2222-2222-2222-222222222222', 'Vehicle Fire', 'OMR, Chennai', 12.82, 80.21, 'critical', 1, 'assigned', 'SUV', 'AMB-07', '4 min', now() - interval '8 minutes'),
  ('33333333-3333-3333-3333-333333333333', 'Bike Breakdown', 'ECR, Pondicherry', 11.94, 79.80, 'medium', 1, 'in-progress', 'Motorcycle', 'PCL-03', '2 min', now() - interval '12 minutes'),
  ('44444444-4444-4444-4444-444444444444', 'Pedestrian Accident', 'GST Road, Tambaram', 12.95, 80.14, 'critical', 2, 'resolved', 'Car', NULL, NULL, now() - interval '18 minutes');

-- 2. Create Shops Table
CREATE TABLE public.shops (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  dist text NOT NULL,
  rating double precision DEFAULT 4.5,
  jobs integer DEFAULT 0,
  eta text NOT NULL,
  color text NOT NULL,
  initial text NOT NULL,
  lat double precision,
  lng double precision,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Seed Shops
INSERT INTO public.shops (name, dist, rating, jobs, eta, color, initial, lat, lng) VALUES
  ('RajeshMech Auto Services', '1.2 km', 4.9, 1240, '8 min', '#3b82f6', 'R', 12.97, 79.99),
  ('SpeedFix Roadside', '2.1 km', 4.8, 890, '12 min', '#8b5cf6', 'S', 12.82, 80.21),
  ('QuickHelp Motors', '3.4 km', 4.7, 2100, '18 min', '#06b6d4', 'Q', 11.94, 79.80),
  ('FastTrack Auto Care', '3.9 km', 4.6, 670, '20 min', '#10b981', 'F', 12.95, 80.14);

-- 3. Create AI Alerts Table
CREATE TABLE public.ai_alerts (
  id serial PRIMARY KEY,
  msg text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'critical')),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Seed AI Alerts
INSERT INTO public.ai_alerts (msg, severity, created_at) VALUES
  ('Critical collision detected — NH-44 near Sriperumbudur', 'critical', now() - interval '2 minutes'),
  ('Possible vehicle fire — OMR near Sholinganallur', 'critical', now() - interval '8 minutes'),
  ('Traffic congestion increasing — GST Road southbound', 'medium', now() - interval '14 minutes'),
  ('Medical emergency suspected — Anna Salai pedestrian crossing', 'medium', now() - interval '20 minutes'),
  ('Heavy rainfall warning — flooding risk in low-lying zones', 'low', now() - interval '25 minutes');

-- 4. Create Notifications Table
CREATE TABLE public.notifications (
  id serial PRIMARY KEY,
  msg text NOT NULL,
  type text NOT NULL CHECK (type IN ('alert', 'dispatch', 'resolved')),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Seed Notifications
INSERT INTO public.notifications (msg, type, created_at) VALUES
  ('New accident detected — NH-44, Sriperumbudur', 'alert', now() - interval '1 minute'),
  ('AMB-07 dispatched to OMR vehicle fire', 'dispatch', now() - interval '8 minutes'),
  ('Emergency resolved — GST Road, Tambaram', 'resolved', now() - interval '18 minutes'),
  ('PCL-03 en route to ECR breakdown case', 'dispatch', now() - interval '12 minutes'),
  ('Fire rescue requested — Rajiv Gandhi Salai', 'alert', now() - interval '22 minutes');

-- 5. Create Hotspots Table
CREATE TABLE public.hotspots (
  id serial PRIMARY KEY,
  road text NOT NULL,
  risk_score integer NOT NULL,
  accidents integer NOT NULL,
  peak text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'critical')),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Seed Hotspots
INSERT INTO public.hotspots (road, risk_score, accidents, peak, severity) VALUES
  ('NH-44, Sriperumbudur Junction', 94, 87, '7PM–10PM', 'critical'),
  ('OMR, Sholinganallur Flyover', 89, 73, '8AM–10AM', 'critical'),
  ('GST Road, Tambaram Signal', 82, 68, '6PM–9PM', 'critical'),
  ('ECR, Mahabalipuram Stretch', 74, 54, '5PM–8PM', 'medium'),
  ('Anna Salai, Gemini Flyover', 68, 49, '9AM–11AM', 'medium'),
  ('Rajiv Gandhi Salai, SIPCOT', 61, 41, '7PM–9PM', 'medium'),
  ('Poonamallee High Road', 52, 33, '8AM–9AM', 'low'),
  ('Mount Road, Thousand Lights', 44, 27, '6PM–8PM', 'low');

-- Enable Realtime for all tables
alter publication supabase_realtime add table public.incidents;
alter publication supabase_realtime add table public.shops;
alter publication supabase_realtime add table public.ai_alerts;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.hotspots;

-- Disable Row-Level Security (RLS) on all tables to allow direct anonymous read/write access (Development / Hackathon mode)
ALTER TABLE public.incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotspots DISABLE ROW LEVEL SECURITY;

-- 6. Create Accidents Table
CREATE TABLE IF NOT EXISTS public.accidents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  status text DEFAULT 'ACCIDENT' NOT NULL,
  location text NOT NULL,
  severity text DEFAULT 'HIGH' NOT NULL,
  time timestamp with time zone DEFAULT now() NOT NULL,
  ambulance text,
  police text,
  fireforce text,
  resolved boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Seed Accidents
INSERT INTO public.accidents (status, location, severity, ambulance, police, fireforce, resolved) VALUES
  ('ACCIDENT', 'Chennai Highway', 'HIGH', NULL, NULL, NULL, false),
  ('ASSIGNED', 'OMR Road near Sholinganallur', 'MEDIUM', 'AMB-05', 'PCL-12', NULL, false),
  ('RESOLVED', 'GST Road, Tambaram', 'LOW', 'AMB-02', 'PCL-01', 'FRU-09', true);

-- Enable Realtime for accidents table
alter publication supabase_realtime add table public.accidents;

-- Disable RLS on accidents table
ALTER TABLE public.accidents DISABLE ROW LEVEL SECURITY;
