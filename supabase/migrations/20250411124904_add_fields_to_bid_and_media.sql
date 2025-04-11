alter table "public"."business_location_customer_bid_media" add column "type" text not null default 'GENERAL'::text;

alter table "public"."business_location_customer_bids" add column "lead_type" text not null default 'setter'::text;

alter table "public"."business_location_job_media" add column "type" text not null default 'GENERAL'::text;


