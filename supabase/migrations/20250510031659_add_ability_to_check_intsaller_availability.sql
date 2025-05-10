set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.location_installers_available(lid integer, start_timestamp timestamp with time zone, end_timestamp timestamp with time zone)
 RETURNS TABLE(profile_id uuid, full_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RETURN QUERY
   select distinct
  blp.profile_id,
  p.full_name
from
  business_location_profiles blp
left join profiles p on p.id = blp.profile_id
where
  blp.location_id = lid
  and blp.is_installer = true
  and blp.profile_id not in (
    select distinct
      bap.profile_id
    from
      business_appointment_profiles bap
      left join business_appointments ba on ba.id = bap.appointment_id
    where
      start_datetime < end_timestamp
      and end_datetime > start_timestamp
  );
END;$function$
;


