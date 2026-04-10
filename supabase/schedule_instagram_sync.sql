-- Reemplaza estos valores antes de ejecutar:
-- TU_PROJECT_URL
-- TU_SERVICE_ROLE_KEY
--
-- Si quieres horario Chile 08:00-23:30 cada 30 minutos
-- y tu proyecto usa UTC, necesitas dos jobs.

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

select cron.schedule(
  'instagram-sync-morning-evening',
  '0,30 11-23 * * *',
  $$
  select
    net.http_post(
      url := 'https://TU_PROJECT_URL/functions/v1/instagram-sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer TU_SERVICE_ROLE_KEY'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);

select cron.schedule(
  'instagram-sync-night',
  '0,30 0-2 * * *',
  $$
  select
    net.http_post(
      url := 'https://TU_PROJECT_URL/functions/v1/instagram-sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer TU_SERVICE_ROLE_KEY'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);
