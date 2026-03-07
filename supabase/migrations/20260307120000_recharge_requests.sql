-- 用户充值申请表：用户提交金额，管理员审核通过后到账
CREATE TABLE public.recharge_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid REFERENCES auth.users(id)
);

CREATE INDEX idx_recharge_requests_user_id ON public.recharge_requests(user_id);
CREATE INDEX idx_recharge_requests_status ON public.recharge_requests(status);

ALTER TABLE public.recharge_requests ENABLE ROW LEVEL SECURITY;

-- 用户只能插入自己的申请（且仅 pending）
CREATE POLICY "Users can insert own recharge requests" ON public.recharge_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 用户只能查看自己的申请
CREATE POLICY "Users can view own recharge requests" ON public.recharge_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 管理员可查看所有申请
CREATE POLICY "Admins can view all recharge requests" ON public.recharge_requests
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 仅管理员可更新（审核：approved/rejected）
CREATE POLICY "Admins can update recharge requests" ON public.recharge_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 管理员可删除（可选，用于清理）
CREATE POLICY "Admins can delete recharge requests" ON public.recharge_requests
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
