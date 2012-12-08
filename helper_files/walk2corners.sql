-- SQL for creating corner points from walkway table in PostGIS
-- Melelani Sax-Barnett, Katie Urey, Scott Parker May-Dec 2012

--import walkway shapefile as LINESTRING -- NOT MULTILINESTRING, or geom won't work
--& vaccum/analyze for better speed
select Populate_Geometry_Columns();

drop table if exists public.corners;

-- 1) create all fields
create table public.corners (
	id serial primary key,
	geom geometry,
	intersection_id bigint,
	fm_bearing int,
	to_bear_a int,
	to_bear_b int,
	c_direct text,
	to_dir_a text,
	to_dir_b text,
	st_lf_id bigint,
	st_rt_id bigint,
	st_lf_nm text,
	st_rt_nm text,
	evaluated text,
	lramp text,
	rramp text,
	texture text,
	flags text
);

-- 2) populate first round of fields from walkways table
insert into public.corners (geom, intersection_id, fm_bearing, to_bear_a, 
	st_lf_id, st_rt_id) 
select distinct
	ST_StartPoint(ww.geom),
	ww.to_end_id as intersection_id,
	ww.fm_bearing,
	ww.to_bearing as to_bear_a,
	ww.fm_join_id as st_lf_id, --was to_join_id
	ww.street_seg as st_rt_id
	from public.walkways ww where ww.walk_type = 'crosswalk';

-- 3) get names
update public.corners set st_rt_nm = s.full_name
	from public.streets s
	where st_rt_id = s.localid;

update public.corners set st_lf_nm = s.full_name
	from public.streets s
	where st_lf_id = s.localid;

-- 4) remove dead-ends
delete from public.corners where st_lf_id = -1;

-- 5) join by the corner w/the same bearing & same intersection id to grab other bearing
update public.corners set to_bear_b = ww.fm_bearing
	from public.walkways ww 
	where (ww.walk_type = 'crosswalk') 
		and (public.corners.intersection_id = ww.to_end_id) 
		and (public.corners.fm_bearing = ww.to_bearing);

-- 6) change bearing to direction
update public.corners set c_direct = 'N' 
	where (fm_bearing >= 0) AND (fm_bearing <= 10);
update public.corners set c_direct = 'NE' 
	where (fm_bearing > 10) AND (fm_bearing < 80);
update public.corners set c_direct = 'E' 
	where (fm_bearing >= 80) AND (fm_bearing <= 100);
update public.corners set c_direct = 'SE' 
	where (fm_bearing > 100) AND (fm_bearing < 170);
update public.corners set c_direct = 'S' 
	where (fm_bearing >= 170) AND (fm_bearing <= 190);
update public.corners set c_direct = 'SW' 
	where (fm_bearing > 190) AND (fm_bearing < 260);
update public.corners set c_direct = 'W' 
	where (fm_bearing >= 260) AND (fm_bearing <= 280);
update public.corners set c_direct = 'NW' 
	where (fm_bearing > 280) AND (fm_bearing < 350);
update public.corners set c_direct = 'N' 
	where (fm_bearing >= 350) AND (fm_bearing <= 360);

update public.corners set to_dir_a = 'N' 
	where (to_bear_a >= 0) AND (to_bear_a <= 10);
update public.corners set to_dir_a = 'NE' 
	where (to_bear_a > 10) AND (to_bear_a < 80);
update public.corners set to_dir_a = 'E' 
	where (to_bear_a >= 80) AND (to_bear_a <= 100);
update public.corners set to_dir_a = 'SE' 
	where (to_bear_a > 100) AND (to_bear_a < 170);
update public.corners set to_dir_a = 'S' 
	where (to_bear_a >= 170) AND (to_bear_a <= 190);
update public.corners set to_dir_a = 'SW' 
	where (to_bear_a > 190) AND (to_bear_a < 260);
update public.corners set to_dir_a = 'W' 
	where (to_bear_a >= 260) AND (to_bear_a <= 280);
update public.corners set to_dir_a = 'NW' 
	where (to_bear_a > 280) AND (to_bear_a < 350);
update public.corners set to_dir_a = 'N' 
	where (to_bear_a >= 350) AND (to_bear_a <= 360);

update public.corners set to_dir_b = 'N' 
	where (to_bear_b >= 0) AND (to_bear_b <= 10);
update public.corners set to_dir_b = 'NE' 
	where (to_bear_b > 10) AND (to_bear_b < 80);
update public.corners set to_dir_b = 'E' 
	where (to_bear_b >= 80) AND (to_bear_b <= 100);
update public.corners set to_dir_b = 'SE' 
	where (to_bear_b > 100) AND (to_bear_b < 170);
update public.corners set to_dir_b = 'S' 
	where (to_bear_b >= 170) AND (to_bear_b <= 190);
update public.corners set to_dir_b = 'SW' 
	where (to_bear_b > 190) AND (to_bear_b < 260);
update public.corners set to_dir_b = 'W' 
	where (to_bear_b >= 260) AND (to_bear_b <= 280);
update public.corners set to_dir_b = 'NW' 
	where (to_bear_b > 280) AND (to_bear_b < 350);
update public.corners set to_dir_b = 'N' 
	where (to_bear_b >= 350) AND (to_bear_b <= 360);

-- 7) Other CartoDB table prep for app
update public.corners set evaluated = 'n';

-- 8) Finish & display
select Populate_Geometry_Columns();
select * from public.corners;
--select * from public.corners where to_dir_b is null;

--after export to shapefile, manually delete any extra corners you don't want
--may also need to manually fix missing to_dir_b values (happens when walkway dataset is missing some crosswalk segments)