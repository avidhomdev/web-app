alter table "public"."business_location_channel_profiles" add column "business_id" uuid not null;

alter table "public"."business_location_channel_profiles" add column "location_id" bigint not null;

alter table "public"."business_location_channel_profiles" add constraint "business_location_channel_profiles_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_channel_profiles" validate constraint "business_location_channel_profiles_business_id_fkey";

alter table "public"."business_location_channel_profiles" add constraint "business_location_channel_profiles_location_id_fkey" FOREIGN KEY (location_id) REFERENCES business_locations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_channel_profiles" validate constraint "business_location_channel_profiles_location_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.profile_exists_in_channel(cId bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
 return exists (
    select 1 from business_location_channel_profiles
    where (select auth.uid()) = business_location_channel_profiles.profile_id
    AND business_location_channel_profiles.channel_id = cId
    );
END;$function$
;

create policy "Enable delete for creator profile"
on "public"."business_location_channel_messages"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = profile_id));


create policy "Enable insert for channel profile"
on "public"."business_location_channel_messages"
as permissive
for insert
to authenticated
with check (profile_exists_in_channel(channel_id));


create policy "Enable select for channel profile"
on "public"."business_location_channel_messages"
as permissive
for select
to authenticated
using (profile_exists_in_channel(channel_id));


create policy "Enable update for creator profile"
on "public"."business_location_channel_messages"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = profile_id));


create policy "Enable all actions for business admin"
on "public"."business_location_channel_profiles"
as permissive
for all
to authenticated
using (business_profile_has_role(business_id, 'admin'::text));


create policy "Enable all actions for business managers"
on "public"."business_location_channel_profiles"
as permissive
for all
to authenticated
using (business_profile_has_role(business_id, 'manager'::text));


create policy "Enable all actions for global admins"
on "public"."business_location_channel_profiles"
as permissive
for all
to authenticated
using (is_global_admin());


create policy "Enable all actions for location admin"
on "public"."business_location_channel_profiles"
as permissive
for all
to authenticated
using (location_profile_has_role(location_id, 'admin'::text));


create policy "Enable all actions for location manager"
on "public"."business_location_channel_profiles"
as permissive
for all
to authenticated
using (location_profile_has_role(location_id, 'manager'::text));


create policy "Enable all actions for business admin"
on "public"."business_location_channels"
as permissive
for all
to authenticated
using (business_profile_has_role(business_id, 'admin'::text));


create policy "Enable all actions for business managers"
on "public"."business_location_channels"
as permissive
for all
to authenticated
using (business_profile_has_role(business_id, 'manager'::text));


create policy "Enable all actions for global admins"
on "public"."business_location_channels"
as permissive
for all
to authenticated
using (is_global_admin());


create policy "Enable all actions for location admin"
on "public"."business_location_channels"
as permissive
for all
to authenticated
using (location_profile_has_role(location_id, 'admin'::text));


create policy "Enable all actions for location manager"
on "public"."business_location_channels"
as permissive
for all
to authenticated
using (location_profile_has_role(location_id, 'manager'::text));


