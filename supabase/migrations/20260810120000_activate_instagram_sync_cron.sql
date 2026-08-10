-- El archivo schedule_instagram_sync.sql quedó con placeholders (TU_PROJECT_URL /
-- TU_SERVICE_ROLE_KEY) sin completar nunca a mano en el SQL editor, así que el
-- cron jamás se activó — por eso Instagram nunca se sincronizaba solo.
-- Se activa acá con los valores reales. Se usa la publishable/anon key en vez
-- de la service role key para el header de autorización: el endpoint no exige
-- service role (ya se probó invocándolo así) y evita exponer el secreto en una
-- migración versionada.
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

select cron.schedule(
  'instagram-sync-winforma-morning-evening',
  '0,30 11-23 * * *',
  $$
  select
    net.http_post(
      url := 'https://rogafinwshzgornhrxap.supabase.co/functions/v1/instagram-sync?site=winforma',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer sb_publishable_NfKcVml8rLAlf050xgJq3g_rq557P6h'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);

select cron.schedule(
  'instagram-sync-winforma-night',
  '0,30 0-2 * * *',
  $$
  select
    net.http_post(
      url := 'https://rogafinwshzgornhrxap.supabase.co/functions/v1/instagram-sync?site=winforma',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer sb_publishable_NfKcVml8rLAlf050xgJq3g_rq557P6h'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);

select cron.schedule(
  'instagram-sync-abajolalinea-morning-evening',
  '5,35 11-23 * * *',
  $$
  select
    net.http_post(
      url := 'https://rogafinwshzgornhrxap.supabase.co/functions/v1/instagram-sync?site=abajolalinea',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer sb_publishable_NfKcVml8rLAlf050xgJq3g_rq557P6h'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);

select cron.schedule(
  'instagram-sync-abajolalinea-night',
  '5,35 0-2 * * *',
  $$
  select
    net.http_post(
      url := 'https://rogafinwshzgornhrxap.supabase.co/functions/v1/instagram-sync?site=abajolalinea',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer sb_publishable_NfKcVml8rLAlf050xgJq3g_rq557P6h'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);
