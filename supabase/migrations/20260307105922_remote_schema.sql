drop extension if exists "pg_net";

drop policy "Admins can delete transactions" on "public"."balance_transactions";

drop policy "Admins can insert transactions" on "public"."balance_transactions";

drop policy "Admins can view all transactions" on "public"."balance_transactions";

drop policy "Users can insert own deduct transactions" on "public"."balance_transactions";

drop policy "Users can view own transactions" on "public"."balance_transactions";

drop policy "Admins can delete balances" on "public"."balances";

drop policy "Admins can insert balances" on "public"."balances";

drop policy "Admins can update balances" on "public"."balances";

drop policy "Admins can view all balances" on "public"."balances";

drop policy "Users can insert own balance" on "public"."balances";

drop policy "Users can update own balance" on "public"."balances";

drop policy "Users can view own balance" on "public"."balances";

drop policy "Admins can delete recharge requests" on "public"."recharge_requests";

drop policy "Admins can update recharge requests" on "public"."recharge_requests";

drop policy "Admins can view all recharge requests" on "public"."recharge_requests";

drop policy "Users can insert own recharge requests" on "public"."recharge_requests";

drop policy "Users can view own recharge requests" on "public"."recharge_requests";

revoke delete on table "public"."balances" from "anon";

revoke insert on table "public"."balances" from "anon";

revoke references on table "public"."balances" from "anon";

revoke select on table "public"."balances" from "anon";

revoke trigger on table "public"."balances" from "anon";

revoke truncate on table "public"."balances" from "anon";

revoke update on table "public"."balances" from "anon";

revoke delete on table "public"."balances" from "authenticated";

revoke insert on table "public"."balances" from "authenticated";

revoke references on table "public"."balances" from "authenticated";

revoke select on table "public"."balances" from "authenticated";

revoke trigger on table "public"."balances" from "authenticated";

revoke truncate on table "public"."balances" from "authenticated";

revoke update on table "public"."balances" from "authenticated";

revoke delete on table "public"."balances" from "service_role";

revoke insert on table "public"."balances" from "service_role";

revoke references on table "public"."balances" from "service_role";

revoke select on table "public"."balances" from "service_role";

revoke trigger on table "public"."balances" from "service_role";

revoke truncate on table "public"."balances" from "service_role";

revoke update on table "public"."balances" from "service_role";

revoke delete on table "public"."recharge_requests" from "anon";

revoke insert on table "public"."recharge_requests" from "anon";

revoke references on table "public"."recharge_requests" from "anon";

revoke select on table "public"."recharge_requests" from "anon";

revoke trigger on table "public"."recharge_requests" from "anon";

revoke truncate on table "public"."recharge_requests" from "anon";

revoke update on table "public"."recharge_requests" from "anon";

revoke delete on table "public"."recharge_requests" from "authenticated";

revoke insert on table "public"."recharge_requests" from "authenticated";

revoke references on table "public"."recharge_requests" from "authenticated";

revoke select on table "public"."recharge_requests" from "authenticated";

revoke trigger on table "public"."recharge_requests" from "authenticated";

revoke truncate on table "public"."recharge_requests" from "authenticated";

revoke update on table "public"."recharge_requests" from "authenticated";

revoke delete on table "public"."recharge_requests" from "service_role";

revoke insert on table "public"."recharge_requests" from "service_role";

revoke references on table "public"."recharge_requests" from "service_role";

revoke select on table "public"."recharge_requests" from "service_role";

revoke trigger on table "public"."recharge_requests" from "service_role";

revoke truncate on table "public"."recharge_requests" from "service_role";

revoke update on table "public"."recharge_requests" from "service_role";

alter table "public"."balances" drop constraint "balances_user_id_key";

alter table "public"."recharge_requests" drop constraint "recharge_requests_amount_check";

alter table "public"."recharge_requests" drop constraint "recharge_requests_reviewed_by_fkey";

alter table "public"."recharge_requests" drop constraint "recharge_requests_status_check";

alter table "public"."recharge_requests" drop constraint "recharge_requests_user_id_fkey";

alter table "public"."balance_transactions" drop constraint "balance_transactions_type_check";

drop function if exists "public"."handle_new_user_balance"();

alter table "public"."balances" drop constraint "balances_pkey";

alter table "public"."recharge_requests" drop constraint "recharge_requests_pkey";

drop index if exists "public"."balances_pkey";

drop index if exists "public"."balances_user_id_key";

drop index if exists "public"."idx_recharge_requests_status";

drop index if exists "public"."idx_recharge_requests_user_id";

drop index if exists "public"."recharge_requests_pkey";

drop table "public"."balances";

drop table "public"."recharge_requests";


  create table "public"."kv_store_178d9451" (
    "key" text not null,
    "value" jsonb not null
      );


alter table "public"."kv_store_178d9451" enable row level security;

alter table "public"."balance_transactions" drop column "created_by";

alter table "public"."balance_transactions" drop column "description";

alter table "public"."balance_transactions" add column "note" text;

alter table "public"."balance_transactions" add column "related_booking_id" uuid;

alter table "public"."bookings" add column "payment_method" text default 'balance'::text;

alter table "public"."profiles" add column "balance" integer not null default 0;

alter table "public"."profiles" add column "display_name" text;

alter table "public"."profiles" add column "phone" text;

CREATE INDEX kv_store_178d9451_key_idx ON public.kv_store_178d9451 USING btree (key text_pattern_ops);

CREATE INDEX kv_store_178d9451_key_idx1 ON public.kv_store_178d9451 USING btree (key text_pattern_ops);

CREATE INDEX kv_store_178d9451_key_idx2 ON public.kv_store_178d9451 USING btree (key text_pattern_ops);

CREATE INDEX kv_store_178d9451_key_idx3 ON public.kv_store_178d9451 USING btree (key text_pattern_ops);

CREATE UNIQUE INDEX kv_store_178d9451_pkey ON public.kv_store_178d9451 USING btree (key);

alter table "public"."kv_store_178d9451" add constraint "kv_store_178d9451_pkey" PRIMARY KEY using index "kv_store_178d9451_pkey";

alter table "public"."balance_transactions" add constraint "balance_transactions_related_booking_id_fkey" FOREIGN KEY (related_booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL not valid;

alter table "public"."balance_transactions" validate constraint "balance_transactions_related_booking_id_fkey";

alter table "public"."balance_transactions" add constraint "balance_transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."balance_transactions" validate constraint "balance_transactions_user_id_fkey";

alter table "public"."balance_transactions" add constraint "balance_transactions_type_check" CHECK ((type = ANY (ARRAY['recharge'::text, 'deduct'::text, 'refund'::text]))) not valid;

alter table "public"."balance_transactions" validate constraint "balance_transactions_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_balance_before_booking()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_balance INTEGER;
BEGIN
  IF COALESCE(NEW.payment_method, 'balance') = 'balance' THEN
    SELECT balance INTO user_balance FROM public.profiles WHERE user_id = NEW.user_id;
    IF user_balance IS NULL OR user_balance < 60 THEN
      RAISE EXCEPTION 'Insufficient balance: need 60, have %', COALESCE(user_balance, 0);
    END IF;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_balance_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF OLD.balance IS DISTINCT FROM NEW.balance AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can modify balance';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.deduct_balance_on_booking()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF COALESCE(NEW.payment_method, 'balance') = 'balance' THEN
    UPDATE public.profiles SET balance = balance - 60 WHERE user_id = NEW.user_id;
    INSERT INTO public.balance_transactions (user_id, amount, type, related_booking_id, note)
    VALUES (NEW.user_id, -60, 'deduct', NEW.id, '预订场地扣除');
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.enforce_daily_booking_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  day_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO day_count
  FROM public.bookings
  WHERE booking_date = NEW.booking_date;
  IF day_count >= 2 THEN
    RAISE EXCEPTION 'This day is fully booked (max 2 hours per day)';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."kv_store_178d9451" to "anon";

grant insert on table "public"."kv_store_178d9451" to "anon";

grant references on table "public"."kv_store_178d9451" to "anon";

grant select on table "public"."kv_store_178d9451" to "anon";

grant trigger on table "public"."kv_store_178d9451" to "anon";

grant truncate on table "public"."kv_store_178d9451" to "anon";

grant update on table "public"."kv_store_178d9451" to "anon";

grant delete on table "public"."kv_store_178d9451" to "authenticated";

grant insert on table "public"."kv_store_178d9451" to "authenticated";

grant references on table "public"."kv_store_178d9451" to "authenticated";

grant select on table "public"."kv_store_178d9451" to "authenticated";

grant trigger on table "public"."kv_store_178d9451" to "authenticated";

grant truncate on table "public"."kv_store_178d9451" to "authenticated";

grant update on table "public"."kv_store_178d9451" to "authenticated";

grant delete on table "public"."kv_store_178d9451" to "service_role";

grant insert on table "public"."kv_store_178d9451" to "service_role";

grant references on table "public"."kv_store_178d9451" to "service_role";

grant select on table "public"."kv_store_178d9451" to "service_role";

grant trigger on table "public"."kv_store_178d9451" to "service_role";

grant truncate on table "public"."kv_store_178d9451" to "service_role";

grant update on table "public"."kv_store_178d9451" to "service_role";


  create policy "Admins can insert balance transactions"
  on "public"."balance_transactions"
  as permissive
  for insert
  to authenticated
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Admins can read all balance transactions"
  on "public"."balance_transactions"
  as permissive
  for select
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Users can read own balance transactions"
  on "public"."balance_transactions"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));


CREATE TRIGGER trg_check_balance_before_booking BEFORE INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.check_balance_before_booking();

CREATE TRIGGER trg_deduct_balance_on_booking AFTER INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.deduct_balance_on_booking();

CREATE TRIGGER trg_check_balance_update BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.check_balance_update();

drop trigger if exists "on_auth_user_created_balance" on "auth"."users";


