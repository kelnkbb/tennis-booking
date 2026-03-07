import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type RechargeRequestStatus = "pending" | "approved" | "rejected";

export interface RechargeRequest {
  id: string;
  user_id: string;
  amount: number;
  status: RechargeRequestStatus;
  note: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export function useRechargeRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RechargeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("recharge_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRequests((data as RechargeRequest[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const submitRequest = useCallback(
    async (amount: number, note?: string) => {
      if (!user) return { error: "请先登录" };
      const a = Math.floor(Number(amount));
      if (!a || a <= 0) return { error: "请输入有效金额" };
      const { error } = await supabase.from("recharge_requests").insert({
        user_id: user.id,
        amount: a,
        status: "pending",
        note: note?.trim() || null,
      });
      if (error) return { error: error.message };
      await fetchRequests();
      return { error: null };
    },
    [user, fetchRequests]
  );

  return { requests, loading, fetchRequests, submitRequest };
}
