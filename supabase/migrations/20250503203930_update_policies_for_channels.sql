drop policy "Enable insert action for base location profile" on "public"."business_location_channels";

drop policy "Enable select action for profiles in channel" on "public"."business_location_channels";

create policy "Enable all actions for location profiles"
on "public"."business_location_channel_profiles"
as permissive
for insert
to authenticated
with check (has_location_profile(location_id));


create policy "Enable select for channel profiles"
on "public"."business_location_channel_profiles"
as permissive
for select
to authenticated
using (profile_exists_in_channel(channel_id));


create policy "Enable insert action for location profile"
on "public"."business_location_channels"
as permissive
for insert
to authenticated
with check (has_location_profile(location_id));


create policy "Enable select action for profiles in channel"
on "public"."business_location_channels"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = creator_id) OR profile_exists_in_channel(id)));



