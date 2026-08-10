-- Completa Caseta Femenina del #1 al #8 (venían del #9 en adelante).
-- Salieron de la página siguiente del listado del canal (vía continuation
-- token), más allá de los ~30 items que trae la carga inicial. Fechas
-- aproximadas otra vez (YouTube solo daba "hace X meses" en ese listado),
-- el orden real sí queda preservado.
insert into public.programs (site, title, youtube_url, category, status, published_at)
values
  ('abajolalinea', '¡TIANE A LA FINAL! Temuco cae en casa y Chile Sub 17 sueña con el Mundial | Caseta Femenina #8', 'https://www.youtube.com/watch?v=JMr6w9pT3_s', 'Caseta Femenina', 'published', '2026-05-09T12:00:00+00:00'),
  ('abajolalinea', '¡SEMANA CLAVE! Endler en semis, Temuco golpeado y debuta la Roja Sub 17 | Caseta Femenina #7', 'https://www.youtube.com/watch?v=joSbYalLAFg', 'Caseta Femenina', 'published', '2026-05-05T12:00:00+00:00'),
  ('abajolalinea', 'SE VIENE UNA FINAL | Chile gana y se juega TODO vs Ecuador | Caseta Femenina #6', 'https://www.youtube.com/watch?v=8EhEvGHYwnI', 'Caseta Femenina', 'published', '2026-05-01T12:00:00+00:00'),
  ('abajolalinea', '¡LA ROJA EN PROBLEMAS! Derrotas ante Argentina y Colombia + Tabla | Caseta Femenina Capítulo #5', 'https://www.youtube.com/watch?v=xojyFFdv2wk', 'Caseta Femenina', 'published', '2026-04-27T12:00:00+00:00'),
  ('abajolalinea', 'TEMUCO CAE EN CASA | Goleada de Colo Colo + Champions y la Roja | Caseta Femenina #4', 'https://www.youtube.com/watch?v=5tEgk1-ibUY', 'Caseta Femenina', 'published', '2026-04-23T12:00:00+00:00'),
  ('abajolalinea', 'Caseta Femenina #3 | Temuco suma un punto de oro + previa fecha 4 + fútbol internacional', 'https://www.youtube.com/watch?v=Ac3AzubPRlQ', 'Caseta Femenina', 'published', '2026-04-15T12:00:00+00:00'),
  ('abajolalinea', '¡PRIMER TRIUNFO DE TEMUCO! Fecha 2 + Tabla + Entrevista | Caseta Femenina #2', 'https://www.youtube.com/watch?v=sZceweGa85c', 'Caseta Femenina', 'published', '2026-04-10T12:00:00+00:00'),
  ('abajolalinea', 'Caseta Femenina | Fecha 1 | Deportes Temuco vs Universidad de Chile', 'https://www.youtube.com/watch?v=LFwZjD1K-QY', 'Caseta Femenina', 'published', '2026-04-05T12:00:00+00:00')
on conflict do nothing;
