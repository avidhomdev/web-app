create table "public"."business_location_job_tasks" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "business_id" uuid not null,
    "location_id" bigint not null,
    "job_id" bigint not null,
    "name" text not null,
    "type" text not null default 'checkbox'::text,
    "notes" text,
    "complete" boolean not null default false,
    "completed_date" date,
    "type_value" text
);


alter table "public"."business_location_job_tasks" enable row level security;

CREATE UNIQUE INDEX business_location_job_tasks_pkey ON public.business_location_job_tasks USING btree (id);

alter table "public"."business_location_job_tasks" add constraint "business_location_job_tasks_pkey" PRIMARY KEY using index "business_location_job_tasks_pkey";

alter table "public"."business_location_job_tasks" add constraint "business_location_job_tasks_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_job_tasks" validate constraint "business_location_job_tasks_business_id_fkey";

alter table "public"."business_location_job_tasks" add constraint "business_location_job_tasks_job_id_fkey" FOREIGN KEY (job_id) REFERENCES business_location_jobs(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_job_tasks" validate constraint "business_location_job_tasks_job_id_fkey";

alter table "public"."business_location_job_tasks" add constraint "business_location_job_tasks_location_id_fkey" FOREIGN KEY (location_id) REFERENCES business_locations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_job_tasks" validate constraint "business_location_job_tasks_location_id_fkey";

grant delete on table "public"."business_location_job_tasks" to "anon";

grant insert on table "public"."business_location_job_tasks" to "anon";

grant references on table "public"."business_location_job_tasks" to "anon";

grant select on table "public"."business_location_job_tasks" to "anon";

grant trigger on table "public"."business_location_job_tasks" to "anon";

grant truncate on table "public"."business_location_job_tasks" to "anon";

grant update on table "public"."business_location_job_tasks" to "anon";

grant delete on table "public"."business_location_job_tasks" to "authenticated";

grant insert on table "public"."business_location_job_tasks" to "authenticated";

grant references on table "public"."business_location_job_tasks" to "authenticated";

grant select on table "public"."business_location_job_tasks" to "authenticated";

grant trigger on table "public"."business_location_job_tasks" to "authenticated";

grant truncate on table "public"."business_location_job_tasks" to "authenticated";

grant update on table "public"."business_location_job_tasks" to "authenticated";

grant delete on table "public"."business_location_job_tasks" to "service_role";

grant insert on table "public"."business_location_job_tasks" to "service_role";

grant references on table "public"."business_location_job_tasks" to "service_role";

grant select on table "public"."business_location_job_tasks" to "service_role";

grant trigger on table "public"."business_location_job_tasks" to "service_role";

grant truncate on table "public"."business_location_job_tasks" to "service_role";

grant update on table "public"."business_location_job_tasks" to "service_role";


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
