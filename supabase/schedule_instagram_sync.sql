-- Reemplaza estos valores antes de ejecutar:
-- TU_PROJECT_URL
-- TU_SERVICE_ROLE_KEY
--
-- Si quieres horario Chile 08:00-23:30 cada 30 minutos
-- y tu proyecto usa UTC, necesitas dos jobs por sitio.

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- ===== Winforma =====

select cron.schedule(
  'instagram-sync-winforma-morning-evening',
  '0,30 11-23 * * *',
  $$
  select
    net.http_post(
      url := 'https://TU_PROJECT_URL/functions/v1/instagram-sync?site=winforma',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer TU_SERVICE_ROLE_KEY'
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
      url := 'https://TU_PROJECT_URL/functions/v1/instagram-sync?site=winforma',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer TU_SERVICE_ROLE_KEY'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);

-- ===== Abajo e' la Línea =====

select cron.schedule(
  'instagram-sync-abajolalinea-morning-evening',
  '5,35 11-23 * * *',
  $$
  select
    net.http_post(
      url := 'https://TU_PROJECT_URL/functions/v1/instagram-sync?site=abajolalinea',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer TU_SERVICE_ROLE_KEY'
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
      url := 'https://TU_PROJECT_URL/functions/v1/instagram-sync?site=abajolalinea',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer TU_SERVICE_ROLE_KEY'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);
