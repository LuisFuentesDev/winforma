-- El dashboard de Supabase no permite editar app_metadata desde la UI (solo
-- vía Admin API/service role), así que se fija directo por SQL para cada
-- cuenta de editor.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"site": "abajolalinea"}'::jsonb
where email = 'abajoelalinea.tv@gmail.com';

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"site": "winforma"}'::jsonb
where email = 'winforma.cl@gmail.com';
