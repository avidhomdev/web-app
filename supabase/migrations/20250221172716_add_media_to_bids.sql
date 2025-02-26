create table "public"."business_location_customer_bid_media" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "business_id" uuid not null,
    "location_id" bigint not null,
    "customer_id" bigint not null,
    "bid_id" bigint not null,
    "creator_id" uuid not null,
    "name" text not null,
    "path" text not null
);


alter table "public"."business_location_customer_bid_media" enable row level security;

CREATE UNIQUE INDEX business_location_customer_bid_media_pkey ON public.business_location_customer_bid_media USING btree (id);

alter table "public"."business_location_customer_bid_media" add constraint "business_location_customer_bid_media_pkey" PRIMARY KEY using index "business_location_customer_bid_media_pkey";

alter table "public"."business_location_customer_bid_media" add constraint "business_location_customer_bid_media_bid_id_fkey" FOREIGN KEY (bid_id) REFERENCES business_location_customer_bids(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_customer_bid_media" validate constraint "business_location_customer_bid_media_bid_id_fkey";

alter table "public"."business_location_customer_bid_media" add constraint "business_location_customer_bid_media_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_customer_bid_media" validate constraint "business_location_customer_bid_media_business_id_fkey";

alter table "public"."business_location_customer_bid_media" add constraint "business_location_customer_bid_media_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_customer_bid_media" validate constraint "business_location_customer_bid_media_creator_id_fkey";

alter table "public"."business_location_customer_bid_media" add constraint "business_location_customer_bid_media_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES business_location_customers(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_customer_bid_media" validate constraint "business_location_customer_bid_media_customer_id_fkey";

alter table "public"."business_location_customer_bid_media" add constraint "business_location_customer_bid_media_location_id_fkey" FOREIGN KEY (location_id) REFERENCES business_locations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_customer_bid_media" validate constraint "business_location_customer_bid_media_location_id_fkey";

grant delete on table "public"."business_location_customer_bid_media" to "anon";

grant insert on table "public"."business_location_customer_bid_media" to "anon";

grant references on table "public"."business_location_customer_bid_media" to "anon";

grant select on table "public"."business_location_customer_bid_media" to "anon";

grant trigger on table "public"."business_location_customer_bid_media" to "anon";

grant truncate on table "public"."business_location_customer_bid_media" to "anon";

grant update on table "public"."business_location_customer_bid_media" to "anon";

grant delete on table "public"."business_location_customer_bid_media" to "authenticated";

grant insert on table "public"."business_location_customer_bid_media" to "authenticated";

grant references on table "public"."business_location_customer_bid_media" to "authenticated";

grant select on table "public"."business_location_customer_bid_media" to "authenticated";

grant trigger on table "public"."business_location_customer_bid_media" to "authenticated";

grant truncate on table "public"."business_location_customer_bid_media" to "authenticated";

grant update on table "public"."business_location_customer_bid_media" to "authenticated";

grant delete on table "public"."business_location_customer_bid_media" to "service_role";

grant insert on table "public"."business_location_customer_bid_media" to "service_role";

grant references on table "public"."business_location_customer_bid_media" to "service_role";

grant select on table "public"."business_location_customer_bid_media" to "service_role";

grant trigger on table "public"."business_location_customer_bid_media" to "service_role";

grant truncate on table "public"."business_location_customer_bid_media" to "service_role";

grant update on table "public"."business_location_customer_bid_media" to "service_role";
