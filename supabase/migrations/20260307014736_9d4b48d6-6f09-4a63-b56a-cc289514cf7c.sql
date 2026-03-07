
-- Balance table for each user
CREATE TABLE public.balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  amount integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.balances ENABLE ROW LEVEL SECURITY;

-- Everyone can read balances (needed for admin to see all, users to see own)
CREATE POLICY "Users can view own balance" ON public.balances
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all balances" ON public.balances
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update balances" ON public.balances
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert balances" ON public.balances
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow system (trigger) to insert balance for new users
CREATE POLICY "Users can insert own balance" ON public.balances
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Balance transactions log
CREATE TABLE public.balance_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('topup', 'deduct', 'refund')),
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.balance_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.balance_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.balance_transactions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert transactions" ON public.balance_transactions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own deduct transactions" ON public.balance_transactions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND type = 'deduct');

-- Create balance record for new users via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.balances (user_id, amount) VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_balance
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_balance();

-- Insert balance=0 for existing users who don't have one
INSERT INTO public.balances (user_id, amount)
SELECT p.user_id, 0 FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.balances b WHERE b.user_id = p.user_id);
