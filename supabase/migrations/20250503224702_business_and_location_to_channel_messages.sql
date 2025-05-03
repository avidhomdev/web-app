alter table "public"."business_location_channel_messages" add column "business_id" uuid not null;

alter table "public"."business_location_channel_messages" add column "location_id" bigint not null;

alter table "public"."business_location_channel_messages" add constraint "business_location_channel_messages_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_channel_messages" validate constraint "business_location_channel_messages_business_id_fkey";

alter table "public"."business_location_channel_messages" add constraint "business_location_channel_messages_location_id_fkey" FOREIGN KEY (location_id) REFERENCES business_locations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."business_location_channel_messages" validate constraint "business_location_channel_messages_location_id_fkey";


