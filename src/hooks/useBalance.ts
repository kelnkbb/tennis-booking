import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface BalanceTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "topup" | "deduct" | "refund";
  description: string | null;
  created_at: string;
  created_by: string | null;
}

export function useBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBalance = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("balances")
      .select("amount")
      .eq("user_id", user.id)
      .single();
    setBalance(data?.amount ?? 0);
    setLoading(false);
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("balance_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setTransactions((data as BalanceTransaction[]) ?? []);
  }, [user]);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const deductBalance = useCallback(async (amount: number, description: string) => {
    if (!user) return false;
    // Update balance
    const { data: current } = await supabase
      .from("balances")
      .select("amount")
      .eq("user_id", user.id)
      .single();
    
    if (!current || current.amount < amount) return false;

    const { error: updateErr } = await supabase
      .from("balances")
      .update({ amount: current.amount - amount, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    
    if (updateErr) return false;

    // Log transaction
    await supabase.from("balance_transactions").insert({
      user_id: user.id,
      amount: -amount,
      type: "deduct" as const,
      description,
      created_by: user.id,
    });

    await fetchBalance();
    await fetchTransactions();
    return true;
  }, [user, fetchBalance, fetchTransactions]);

  const hasEverToppedUp = useCallback(() => {
    return transactions.some((t) => t.type === "topup");
  }, [transactions]);

  return { balance, transactions, loading, fetchBalance, fetchTransactions, deductBalance, hasEverToppedUp };
}
