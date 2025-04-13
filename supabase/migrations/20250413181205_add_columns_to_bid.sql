alter table "public"."business_integrations" alter column "status" drop default;

alter type "public"."row_status" rename to "row_status__old_version_to_be_dropped";

create type "public"."row_status" as enum ('inactive', 'active', 'draft');

alter table "public"."business_integrations" alter column status type "public"."row_status" using status::text::"public"."row_status";

alter table "public"."business_integrations" alter column "status" set default 'active'::row_status;

drop type "public"."row_status__old_version_to_be_dropped";

alter table "public"."business_location_customer_bids" add column "has_water_rebate" boolean not null default false;

alter table "public"."business_location_customer_bids" add column "hoa_approval_required" boolean not null default false;

alter table "public"."business_location_customer_bids" add column "hoa_contact_email" text;

alter table "public"."business_location_customer_bids" add column "hoa_contact_name" text;

alter table "public"."business_location_customer_bids" add column "hoa_contact_phone" text;

alter table "public"."business_location_customer_bids" add column "status" row_status not null default 'draft'::row_status;

alter table "public"."business_location_customer_bids" add column "water_rebate_company" text;


