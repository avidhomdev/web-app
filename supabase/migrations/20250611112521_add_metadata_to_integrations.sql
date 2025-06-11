alter table "public"."business_integrations" add column "metadata" jsonb not null default '{}'::jsonb;


