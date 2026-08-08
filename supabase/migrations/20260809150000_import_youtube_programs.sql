-- Importa los últimos videos del canal de YouTube de Abajo e' la Línea
-- (https://www.youtube.com/@abajoelalineatv) vía su feed RSS oficial.
-- Solo se guarda la URL del video, nunca el archivo.
insert into public.programs (site, title, youtube_url, category, status, published_at)
values
  ('abajolalinea', '¡TEMUCO VS RECOLETA SUSPENDIDO POR LLUVIA! Tabla, fecha 20 y ascenso femenino | Caseta #18', 'https://www.youtube.com/watch?v=yALv0AEDhTU', 'Caseta Femenina', 'published', '2026-08-05T20:32:47+00:00'),
  ('abajolalinea', 'De Ghibli a El pianista: conoce la cartelera de Cine Club Padre las Casas | Capítulo 1', 'https://www.youtube.com/watch?v=Ijw1jw35Yuk', 'Cine Club', 'published', '2026-08-03T21:31:22+00:00'),
  ('abajolalinea', 'ÁGORA | Raúl Díaz Acevedo: guitarra traspuesta y memoria campesina', 'https://www.youtube.com/watch?v=EkV1lnL3l_8', 'Ágora', 'published', '2026-08-03T20:55:38+00:00'),
  ('abajolalinea', '¡TEMUCO SE JUEGA LA TEMPORADA! Derrotas ante Magallanes y UC + final ante Recoleta | Caseta #17', 'https://www.youtube.com/watch?v=CQIF7Gc062I', 'Caseta Femenina', 'published', '2026-07-30T19:36:07+00:00'),
  ('abajolalinea', 'Río Cautín: memoria, rescate y organización comunitaria | Desde el Pueblo T2E2', 'https://www.youtube.com/watch?v=OLKzdJoK1nM', 'Desde el Pueblo', 'published', '2026-07-25T20:08:42+00:00'),
  ('abajolalinea', 'ÁGORA | Claudia Tapia y el rol social del arte en La Araucanía', 'https://www.youtube.com/watch?v=nfdhpHwl_M4', 'Ágora', 'published', '2026-07-21T22:30:39+00:00'),
  ('abajolalinea', '¡SEMANA NEGRA PARA TEMUCO! Doble derrota, zona roja y se viene final ante Magallanes | Caseta #16', 'https://www.youtube.com/watch?v=1h4IXpbMpCo', 'Caseta Femenina', 'published', '2026-07-17T23:29:10+00:00'),
  ('abajolalinea', 'ÁGORA | El legado cultural de Nancy San Martín en La Araucanía', 'https://www.youtube.com/watch?v=DE2XRPGd_zg', 'Ágora', 'published', '2026-07-14T22:00:41+00:00'),
  ('abajolalinea', 'Mercado Municipal de Temuco inicia nueva etapa con entrega de terreno y reinicio de obras', 'https://www.youtube.com/watch?v=Ok_N5YGt_Us', 'Comunidad', 'published', '2026-07-14T01:35:32+00:00'),
  ('abajolalinea', 'ÁGORA | Geraldine Peralta: pintura, docencia y arte joven en La Araucanía', 'https://www.youtube.com/watch?v=LxNZK7df-pY', 'Ágora', 'published', '2026-07-11T01:01:47+00:00'),
  ('abajolalinea', 'Camila Rapiman - Deportes Temuco vs Universidad de Concepción', 'https://www.youtube.com/watch?v=yUwmrutdFi0', 'Deportes', 'published', '2026-07-09T02:11:03+00:00'),
  ('abajolalinea', 'La Voz de la Hinchada: cuando cubrir también es acompañar', 'https://www.youtube.com/watch?v=r--kEAwUdls', 'Deportes', 'published', '2026-07-09T02:09:56+00:00'),
  ('abajolalinea', '¡HAT-TRICK Y DESAHOGO ALBIVERDE! Deportes Temuco 3-2 Palestino | Caseta Femenina #15', 'https://www.youtube.com/watch?v=ra8FiG5tnHg', 'Caseta Femenina', 'published', '2026-07-08T03:19:34+00:00'),
  ('abajolalinea', 'PARTIDO COMPLETO Deportes Temuco 3-2 Palestino - Hattrick de Victoria Caballero | Liga Femenina 2026', 'https://www.youtube.com/watch?v=eMo6I5jzH4I', 'Deportes', 'published', '2026-07-04T03:46:02+00:00'),
  ('abajolalinea', '¡TEMUCO NO LEVANTA! La U golea 6-1, Recoleta suma y la zona baja arde | Caseta Femenina #14', 'https://www.youtube.com/watch?v=Ls5HmRy7pZ4', 'Caseta Femenina', 'published', '2026-07-01T21:01:25+00:00')
on conflict do nothing;
