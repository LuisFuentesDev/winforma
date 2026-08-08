-- El feed RSS de YouTube solo trae los últimos 15 videos del canal en
-- general (mezclando todos los programas), así que se perdían episodios
-- viejos de Caseta Femenina (#9 a #13) tapados por Ágora/Cine Club/etc.
-- Esta tanda sale del listado renderizado de la pestaña "Videos" del canal
-- (hasta 30 items), que sí trae más historial. Las fechas de estos son
-- aproximadas (YouTube solo daba "hace 1/2/3 meses" en ese listado, no
-- fecha exacta) pero preservan el orden real de publicación.
insert into public.programs (site, title, youtube_url, category, status, published_at)
values
  ('abajolalinea', 'ÁGORA | Arte, grabado y memoria territorial con Daniel Lagos', 'https://www.youtube.com/watch?v=BuV5lcXnp-c', 'Ágora', 'published', '2026-07-01T12:00:00+00:00'),
  ('abajolalinea', '¡TEMUCO CIERRA LA PRIMERA RUEDA EN ZONA ROJA! Polémica ante Unión y tabla final | Caseta #13', 'https://www.youtube.com/watch?v=Fipabu7-zJY', 'Caseta Femenina', 'published', '2026-06-30T12:00:00+00:00'),
  ('abajolalinea', 'Organizaciones de Derechos Humanos de La Araucanía alertan retrocesos y llaman a reorganizarse', 'https://www.youtube.com/watch?v=um0dRry_9v0', 'Comunidad', 'published', '2026-06-29T12:00:00+00:00'),
  ('abajolalinea', 'ÁGORA | Eugenio Salas: arte, cultura mapuche y Wiñol Tripantu', 'https://www.youtube.com/watch?v=Kf-Y0LlO-x8', 'Ágora', 'published', '2026-06-28T12:00:00+00:00'),
  ('abajolalinea', '¡CHILE QUEDA FUERA DEL MUNDIAL! Fracaso ante Ecuador y fin del sueño Brasil 2027', 'https://www.youtube.com/watch?v=loUj4xCu_cY', 'Deportes', 'published', '2026-06-27T12:00:00+00:00'),
  ('abajolalinea', 'ÁGORA | Eric Iturriaga y los desafíos de la cultura en La Araucanía', 'https://www.youtube.com/watch?v=k1evtOqYhkU', 'Ágora', 'published', '2026-06-26T12:00:00+00:00'),
  ('abajolalinea', 'Homenaje a nuestras dirigentes que dejaron huella en la comunidad | Plaza Costanera de Newen', 'https://www.youtube.com/watch?v=KDzFxiXo4i8', 'Comunidad', 'published', '2026-06-25T12:00:00+00:00'),
  ('abajolalinea', 'ÁGORA | Desafíos de la cultura en La Araucanía con Samir Manukian', 'https://www.youtube.com/watch?v=YsgRAiPTzGo', 'Ágora', 'published', '2026-06-09T12:00:00+00:00'),
  ('abajolalinea', 'Paro Estudiantil en Temuco: estudiantes marchan contra recortes en educación, salud y cultura', 'https://www.youtube.com/watch?v=oXtdLTPZB2Y', 'Comunidad', 'published', '2026-06-08T12:00:00+00:00'),
  ('abajolalinea', '¡TEMUCO NO LEVANTA! Gol polémico, derrota ante Wanderers y Chile se juega todo | Caseta #11', 'https://www.youtube.com/watch?v=GiDODRXL3Lo', 'Caseta Femenina', 'published', '2026-06-07T12:00:00+00:00'),
  ('abajolalinea', 'Comunidad educativa del ISETT denuncia hechos de violencia y falta de insumos para prácticas', 'https://www.youtube.com/watch?v=EDvioABGv3M', 'Comunidad', 'published', '2026-06-06T12:00:00+00:00'),
  ('abajolalinea', 'Deportes Temuco vs Santiago Wanderers 0-1 | Resumen Fecha 11 Liga Femenina 2026', 'https://www.youtube.com/watch?v=GN2ssyc_Gfk', 'Deportes', 'published', '2026-06-05T12:00:00+00:00'),
  ('abajolalinea', '¡TEMUCO ZONA DE DESCENSO! Barcelona golea a Lyon y Chile va por Brasil 2027 | Caseta #10', 'https://www.youtube.com/watch?v=HYXjV3ReLoE', 'Caseta Femenina', 'published', '2026-06-04T12:00:00+00:00'),
  ('abajolalinea', 'Hogares estudiantiles mapuche exigen respuestas a Junaeb por infraestructura, becas y recortes', 'https://www.youtube.com/watch?v=0LQ7CycWuJw', 'Comunidad', 'published', '2026-06-03T12:00:00+00:00'),
  ('abajolalinea', '¡TEMUCO EN ZONA ROJA! Polémica por Esteban Valencia y Sub 17 al Mundial | Caseta Femenina #9', 'https://www.youtube.com/watch?v=w4fX8pXZL3Y', 'Caseta Femenina', 'published', '2026-06-02T12:00:00+00:00'),
  ('abajolalinea', 'Estudiantes protestan en Temuco contra alzas y recortes del gobierno', 'https://www.youtube.com/watch?v=WZ6yBgWW6HM', 'Comunidad', 'published', '2026-06-01T12:00:00+00:00'),
  ('abajolalinea', 'Día del Patrimonio 2026 en La Araucanía: actividades, memoria y cultura regional', 'https://www.youtube.com/watch?v=274t272qTPk', 'Cultura', 'published', '2026-05-10T12:00:00+00:00')
on conflict do nothing;
