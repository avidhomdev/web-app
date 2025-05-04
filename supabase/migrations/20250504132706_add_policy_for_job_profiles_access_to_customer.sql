create policy "Enable select for job profiles" on "public"."business_location_customers" as permissive for
select
   to authenticated using (
      (
         (
            SELECT
               auth.uid () AS uid
         ) IN (
            SELECT DISTINCT
               business_location_job_profiles.profile_id
            FROM
               (
                  business_location_job_profiles
                  LEFT JOIN business_location_jobs ON (
                     (
                        business_location_jobs.id = business_location_job_profiles.job_id
                     )
                  )
               )
            WHERE
               (
                  business_location_jobs.customer_id = business_location_customers.id
               )
         )
      )
   );
