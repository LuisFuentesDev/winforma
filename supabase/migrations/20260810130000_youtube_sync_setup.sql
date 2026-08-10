-- Config para el sync de YouTube: channel_id del canal de Abajo e' la Línea
-- (https://www.youtube.com/@abajoelalineatv, resuelto vía búsqueda web).
insert into public.config (key, value, updated_at)
values ('youtube_channel_id:abajolalinea', 'UCDFC2LfQ-hE11jUfX7MfrZQ', now())
on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at;

-- Corre cada hora; el feed RSS de YouTube trae hasta 15 videos, de sobra para
-- detectar lo nuevo entre dos corridas de una revisión comunitaria.
select cron.schedule(
  'youtube-sync-abajolalinea',
  '15 * * * *',
  $$
  select
    net.http_post(
      url := 'https://rogafinwshzgornhrxap.supabase.co/functions/v1/youtube-sync?site=abajolalinea',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer sb_publishable_NfKcVml8rLAlf050xgJq3g_rq557P6h'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);
