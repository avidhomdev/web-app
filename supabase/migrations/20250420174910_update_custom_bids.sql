alter table "public"."business_location_customer_bid_products" drop constraint "business_location_customer_bid_products_pkey";

drop index if exists "public"."business_location_customer_bid_products_pkey";

alter table "public"."business_location_customer_bid_products" drop column "id";

alter table "public"."business_location_customer_bids" add column "discount" double precision not null default '0'::double precision;

alter table "public"."business_location_customer_bids" alter column "commission" drop default;

alter table "public"."business_location_customer_bids" alter column "commission" set data type double precision using "commission"::double precision;

alter table "public"."business_location_jobs" add column "discount" double precision;

CREATE UNIQUE INDEX business_location_customer_bid_products_pkey ON public.business_location_customer_bid_products USING btree (bid_id, product_id);

alter table "public"."business_location_customer_bid_products" add constraint "business_location_customer_bid_products_pkey" PRIMARY KEY using index "business_location_customer_bid_products_pkey";


