-- Fuentes RSS de ejemplo (ajustar según el foco geográfico real del reporte).
-- panel_hint sólo orienta la clasificación inicial; el workflow de n8n
-- reclasifica por contenido/keywords.

insert into sources (name, site_url, rss_url, country, panel_hint) values
  ('BBC Mundo', 'https://www.bbc.com/mundo', 'https://feeds.bbci.co.uk/mundo/rss.xml', null, 'exploracion_exterior'),
  ('DW Español', 'https://www.dw.com/es', 'https://rss.dw.com/rdf/rss-sp-all', null, 'exploracion_exterior'),
  ('Reuters World', 'https://www.reuters.com/world/', 'https://www.reutersagency.com/feed/?best-topics=world&post_type=best', null, 'exploracion_exterior'),
  ('Infobae', 'https://www.infobae.com', 'https://www.infobae.com/arc/outboundfeeds/rss/', null, 'exploracion_interna'),
  ('El Tiempo - Colombia', 'https://www.eltiempo.com', 'https://www.eltiempo.com/rss/colombia.xml', 'Colombia', 'exploracion_interna')
on conflict do nothing;
