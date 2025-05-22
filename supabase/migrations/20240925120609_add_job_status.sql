drop policy "Enable all for location employees" on "public"."business_location_jobs";

create policy "Enable insert for location employees" on "public"."business_location_jobs" as permissive for insert to authenticated
with
   check (
      (
         (
            SELECT
               auth.uid () AS uid
         ) IN (
            SELECT
               business_location_profiles.profile_id
            FROM
               business_location_profiles
            WHERE
               (
                  business_location_profiles.location_id = business_location_jobs.business_location_id
               )
         )
      )
   );

create policy "Enable select for closer and installer" on "public"."business_location_jobs" as permissive for
select
   to public using (
      (
         (
            (
               SELECT
                  auth.uid () AS uid
            ) = closer_id
         )
         OR (
            (
               SELECT
                  auth.uid () AS uid
            ) = installer_id
         )
      )
   );

create policy "Enable select for location employees" on "public"."businesses" as permissive for
select
   to public using (
      (
         (
            SELECT
               auth.uid () AS uid
         ) IN (
            SELECT
               business_profiles.profile_id
            FROM
               business_profiles
            WHERE
               (business_profiles.business_id = businesses.id)
         )
      )
   );
