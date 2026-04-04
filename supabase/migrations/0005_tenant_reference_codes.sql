alter table profiles
add column if not exists tenant_reference_code text unique;

update profiles
set tenant_reference_code = concat(
  'PPR-',
  upper(substr(replace(id::text, '-', ''), 1, 4)),
  '-',
  upper(substr(replace(id::text, '-', ''), 5, 4))
)
where role = 'tenant'
  and tenant_reference_code is null;
