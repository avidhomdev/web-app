alter table "public"."profiles" add column "address" text;

alter table "public"."profiles" add column "address2" text;

alter table "public"."profiles" add column "city" text;

alter table "public"."profiles" add column "email" text;

alter table "public"."profiles" add column "phone" text;

alter table "public"."profiles" add column "postal_code" text;

alter table "public"."profiles" add column "state" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id,new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;


