-- Corrige una nota mal categorizada antes de ampliar las keywords de Deportes:
-- el caption no traía ninguna palabra clave y cayó al default "Comunidad".
update public.articles
set category = 'Deportes'
where slug = 'comienza-la-lucha-por-las-semifinales-en-el-ascenso-femenino'
  and site = 'abajolalinea';
