drop policy "Enable all actions for business admin" on "public"."business_location_job_tasks";

drop policy "Enable all actions for business managers" on "public"."business_location_job_tasks";

drop policy "Enable all actions for global admins" on "public"."business_location_job_tasks";

drop policy "Enable all actions for job profiles" on "public"."business_location_job_tasks";

drop policy "Enable all actions for location admin" on "public"."business_location_job_tasks";

drop policy "Enable all actions for location manager" on "public"."business_location_job_tasks";

alter table "public"."business_location_job_tasks"
add column "completed_by_profile_id" uuid;

alter table "public"."business_location_job_tasks" add constraint "business_location_job_tasks_completed_by_profile_id_fkey" FOREIGN KEY (completed_by_profile_id) REFERENCES profiles (id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."business_location_job_tasks" validate constraint "business_location_job_tasks_completed_by_profile_id_fkey";
