-- Soporte para las 4 hojas de reporte completas (Exterior, Interior,
-- Aero Naval, Meteorológico): permite registrar eventos/incidencias
-- individuales también para los paneles 3 y 4, y agrega campos de
-- ubicación/hora legibles para la tabla de incidencias de cada hoja.

alter table situational_events drop constraint if exists situational_events_panel_check;
alter table situational_events add constraint situational_events_panel_check
  check (panel in ('exploracion_exterior', 'exploracion_interna', 'aero_naval', 'meteorologia'));

alter table situational_events add column if not exists location_label text;
alter table situational_events add column if not exists event_time text;
