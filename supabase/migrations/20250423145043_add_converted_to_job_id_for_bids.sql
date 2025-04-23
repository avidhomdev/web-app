alter table "public"."business_location_customer_bids" add column "converted_to_job_id" bigint;

alter table "public"."business_location_customer_bids" add constraint "business_location_customer_bids_converted_to_job_id_fkey" FOREIGN KEY (converted_to_job_id) REFERENCES business_location_jobs(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."business_location_customer_bids" validate constraint "business_location_customer_bids_converted_to_job_id_fkey";


