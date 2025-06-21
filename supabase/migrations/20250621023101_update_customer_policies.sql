create policy "Enable select for appointment profiles"
on "public"."business_location_customers"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT DISTINCT business_appointment_profiles.profile_id
   FROM (business_appointment_profiles
     LEFT JOIN business_appointments ON ((business_appointments.id = business_appointment_profiles.appointment_id)))
  WHERE (business_appointments.customer_id = business_location_customers.id))));



