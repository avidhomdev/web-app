drop policy "Enable delete action for creator" on "public"."business_location_profile_availability";

drop policy "Enable insert action for admin on all profiles" on "public"."business_location_profile_availability";

drop policy "Enable insert action for manager on all profiles" on "public"."business_location_profile_availability";

drop policy "Enable insert action for own profile" on "public"."business_location_profile_availability";

drop policy "Enable select action for profiles in channel" on "public"."business_location_profile_availability";

drop policy "Enable update action for admin" on "public"."business_location_profile_availability";

drop policy "Enable update action for manager" on "public"."business_location_profile_availability";

drop policy "Enable update action for profile" on "public"."business_location_profile_availability";

revoke delete on table "public"."business_location_profile_availability" from "anon";

revoke insert on table "public"."business_location_profile_availability" from "anon";

revoke references on table "public"."business_location_profile_availability" from "anon";

revoke select on table "public"."business_location_profile_availability" from "anon";

revoke trigger on table "public"."business_location_profile_availability" from "anon";

revoke truncate on table "public"."business_location_profile_availability" from "anon";

revoke update on table "public"."business_location_profile_availability" from "anon";

revoke delete on table "public"."business_location_profile_availability" from "authenticated";

revoke insert on table "public"."business_location_profile_availability" from "authenticated";

revoke references on table "public"."business_location_profile_availability" from "authenticated";

revoke select on table "public"."business_location_profile_availability" from "authenticated";

revoke trigger on table "public"."business_location_profile_availability" from "authenticated";

revoke truncate on table "public"."business_location_profile_availability" from "authenticated";

revoke update on table "public"."business_location_profile_availability" from "authenticated";

revoke delete on table "public"."business_location_profile_availability" from "service_role";

revoke insert on table "public"."business_location_profile_availability" from "service_role";

revoke references on table "public"."business_location_profile_availability" from "service_role";

revoke select on table "public"."business_location_profile_availability" from "service_role";

revoke trigger on table "public"."business_location_profile_availability" from "service_role";

revoke truncate on table "public"."business_location_profile_availability" from "service_role";

revoke update on table "public"."business_location_profile_availability" from "service_role";

alter table "public"."business_location_profile_availability" drop constraint "business_location_profile_availability_business_id_fkey";

alter table "public"."business_location_profile_availability" drop constraint "business_location_profile_availability_id_key";

alter table "public"."business_location_profile_availability" drop constraint "business_location_profile_availability_location_id_fkey";

alter table "public"."business_location_profile_availability" drop constraint "business_location_profile_availability_profile_id_fkey";

alter table "public"."business_location_profile_availability" drop constraint "business_location_profile_availability_pkey";

drop index if exists "public"."business_location_profile_availability_id_key";

drop index if exists "public"."business_location_profile_availability_pkey";

drop table "public"."business_location_profile_availability";

alter table "public"."business_profiles" add column "availability" jsonb not null default '{"Friday": {"9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true}, "Monday": {"9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true}, "Sunday": {}, "Tuesday": {"9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true}, "Saturday": {}, "Thursday": {"9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true}, "Wednesday": {"9": true, "10": true, "11": true, "12": true, "13": true, "14": true, "15": true, "16": true}}'::jsonb;

create policy "Enable users to update their own profile"
on "public"."business_profiles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = profile_id))
with check ((( SELECT auth.uid() AS uid) = profile_id));



