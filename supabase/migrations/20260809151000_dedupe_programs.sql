-- El import por RSS insertó de nuevo un video que ya se había cargado a mano
-- desde el panel (mismo youtube_url). Se deja solo la fila más antigua por
-- (site, youtube_url) y se borran los duplicados.
delete from public.programs p
using (
  select id,
    row_number() over (partition by site, youtube_url order by created_at asc) as rn
  from public.programs
) dup
where p.id = dup.id and dup.rn > 1;
