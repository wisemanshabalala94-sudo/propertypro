-- Ntuthuko Social Club Test Organization
insert into public.organizations (name, slug, subscription_tier, platform_fee_enabled, platform_fee_amount, subscription_status)
values ('Ntuthuko Social Club', 'ntuthuko-social-club', 'test_free', true, 100, 'active')
on conflict (slug) do nothing;

-- Test property
insert into public.properties (organization_id, name, address, city, property_type)
select id, 'Ntuthuko Apartments', '123 Main Street', 'Johannesburg', 'residential'
from public.organizations where slug = 'ntuthuko-social-club'
on conflict do nothing;

-- Test units
insert into public.units (property_id, unit_number, unit_type, bedrooms, bathrooms, monthly_rent, deposit_amount, status)
select p.id, '1A', '1bed', 1, 1, 3500, 3500, 'vacant'
from public.properties p join public.organizations o on p.organization_id = o.id
where o.slug = 'ntuthuko-social-club'
on conflict do nothing;

insert into public.units (property_id, unit_number, unit_type, bedrooms, bathrooms, monthly_rent, deposit_amount, status)
select p.id, '1B', '2bed', 2, 1, 5000, 5000, 'vacant'
from public.properties p join public.organizations o on p.organization_id = o.id
where o.slug = 'ntuthuko-social-club'
on conflict do nothing;

insert into public.units (property_id, unit_number, unit_type, bedrooms, bathrooms, monthly_rent, deposit_amount, status)
select p.id, '2A', '2bed', 2, 1, 5500, 5500, 'vacant'
from public.properties p join public.organizations o on p.organization_id = o.id
where o.slug = 'ntuthuko-social-club'
on conflict do nothing;
