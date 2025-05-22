create type "public"."job_status" as enum ('packet_pending', 'packet_complete', 'scheduled', 'install_complete', 'complete', 'cancelled', 'billed', 'commissioned');

alter table "public"."business_location_jobs" add column "job_status" job_status not null default 'packet_pending'::job_status;

alter table "public"."business_location_jobs" add column "status" row_status not null default 'active'::row_status;



