-- PropertyPro Seed Data
-- Run this in Supabase SQL Editor AFTER migrations are applied

-- 1. Create Demo Organization
INSERT INTO organizations (
  id, name, slug, subscription_tier, subscription_status, 
  platform_fee_enabled, platform_fee_amount, created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'PropertyPro Demo Org',
  'demo-org',
  'basic',
  'active',
  false,
  0,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- 2. Create Demo Properties
INSERT INTO properties (id, organization_id, name, address, city, property_type, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000010'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Riverside Apartments', '12 Market Street', 'Johannesburg', 'residential', NOW()),
  ('00000000-0000-0000-0000-000000000011'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Palm Court', '88 Commissioner Street', 'Johannesburg', 'residential', NOW())
ON CONFLICT DO NOTHING;

-- 3. Create Demo Units
INSERT INTO units (id, property_id, unit_number, unit_type, bedrooms, bathrooms, monthly_rent, deposit_amount, status, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000020'::uuid, '00000000-0000-0000-0000-000000000010'::uuid, '1A', '1bed', 1, 1, 3500, 3500, 'occupied', NOW()),
  ('00000000-0000-0000-0000-000000000021'::uuid, '00000000-0000-0000-0000-000000000010'::uuid, '1B', '2bed', 2, 1, 5000, 5000, 'vacant', NOW()),
  ('00000000-0000-0000-0000-000000000022'::uuid, '00000000-0000-0000-0000-000000000011'::uuid, '2A', '2bed', 2, 1, 5500, 5500, 'occupied', NOW())
ON CONFLICT DO NOTHING;

-- 4. Create Demo Invoices
INSERT INTO invoices (id, organization_id, tenant_id, lease_id, invoice_number, invoice_type, amount, platform_fee, amount_paid, due_date, status, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000030'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'INV-2026-001', 'rent', 3500, 0, 3500, '2026-05-01', 'paid', NOW()),
  ('00000000-0000-0000-0000-000000000031'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'INV-2026-002', 'rent', 5500, 0, 0, '2026-05-01', 'unpaid', NOW())
ON CONFLICT DO NOTHING;
