create policy "Enable all actions for business admin"
on "public"."business_location_job_tasks"
as permissive
for all
to authenticated
using (business_profile_has_role(business_id, 'admin'::text));


create policy "Enable all actions for business managers"
on "public"."business_location_job_tasks"
as permissive
for all
to authenticated
using (business_profile_has_role(business_id, 'manager'::text));


create policy "Enable all actions for global admins"
on "public"."business_location_job_tasks"
as permissive
for all
to authenticated
using (is_global_admin());


create policy "Enable all actions for job profiles"
on "public"."business_location_job_tasks"
as permissive
for all
to authenticated
using (has_job_profile(job_id));


create policy "Enable all actions for location admin"
on "public"."business_location_job_tasks"
as permissive
for all
to authenticated
using (location_profile_has_role(location_id, 'admin'::text));


create policy "Enable all actions for location manager"
on "public"."business_location_job_tasks"
as permissive
for all
to authenticated
using (location_profile_has_role(location_id, 'manager'::text));



