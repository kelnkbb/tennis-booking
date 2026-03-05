-- Enforce global daily booking cap: max 2 bookings per date (all users combined)
CREATE OR REPLACE FUNCTION public.enforce_daily_booking_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

DROP TRIGGER IF EXISTS trg_enforce_daily_booking_limit ON public.bookings;
CREATE TRIGGER trg_enforce_daily_booking_limit
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.enforce_daily_booking_limit();