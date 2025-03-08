alter table "public"."business_integrations" drop constraint "business_integrations_pkey";

drop index if exists "public"."business_integrations_pkey";

alter table "public"."business_integrations" drop column "id";

alter table "public"."business_integrations" add column "account_id" text;

alter table "public"."business_integrations" add column "expires_at" bigint;

alter table "public"."business_integrations" add column "extras" json;

alter table "public"."business_integrations" add column "refresh_token" text;

alter table "public"."business_integrations" add column "revoked_on_date" date;

CREATE UNIQUE INDEX business_integrations_pkey ON public.business_integrations USING btree (business_id, resource);

alter table "public"."business_integrations" add constraint "business_integrations_pkey" PRIMARY KEY using index "business_integrations_pkey";


