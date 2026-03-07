
-- Allow users to update their own balance (for deduction during booking)
CREATE POLICY "Users can update own balance" ON public.balances
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to delete balances (for user deletion)
CREATE POLICY "Admins can delete balances" ON public.balances
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete balance transactions
CREATE POLICY "Admins can delete transactions" ON public.balance_transactions
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
