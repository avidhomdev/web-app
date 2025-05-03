alter table "public"."business_location_channels" add column "creator_id" uuid;

alter table "public"."business_location_channels" add constraint "business_location_channels_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."business_location_channels" validate constraint "business_location_channels_creator_id_fkey";

create policy "Enable delete action for creator"
on "public"."business_location_channels"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = creator_id));


create policy "Enable insert action for base location profile"
on "public"."business_location_channels"
as permissive
for insert
to authenticated
with check (location_profile_has_role(location_id, 'base'::text));


create policy "Enable select action for profiles in channel"
on "public"."business_location_channels"
as permissive
for select
to authenticated
using (profile_exists_in_channel(id));


create policy "Enable update action for creator"
on "public"."business_location_channels"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = creator_id));



