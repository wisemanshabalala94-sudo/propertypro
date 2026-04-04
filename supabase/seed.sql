insert into organizations (id, name, subscription_status)
values ('11111111-1111-1111-1111-111111111111', 'PropertyPro Demo Org', 'active')
on conflict do nothing;

insert into properties (organization_id, name, address)
values
  ('11111111-1111-1111-1111-111111111111', 'Riverside Apartments', '12 Market Street, Johannesburg'),
  ('11111111-1111-1111-1111-111111111111', 'Palm Court', '88 Commissioner Street, Johannesburg')
on conflict do nothing;

