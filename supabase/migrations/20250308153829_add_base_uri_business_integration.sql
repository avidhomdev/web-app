alter table "public"."business_integrations" drop column "extras";

alter table "public"."business_integrations" add column "base_uri" text;


