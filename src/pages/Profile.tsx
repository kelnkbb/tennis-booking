import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";
<<<<<<< HEAD
import { useRechargeRequests } from "@/hooks/useRechargeRequests";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Wallet, History, Save, PlusCircle, Loader2 } from "lucide-react";
=======
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Wallet, History, Save } from "lucide-react";
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
import { toast } from "sonner";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function ProfilePage() {
  const { user, username } = useAuth();
  const { balance, transactions, loading: balanceLoading } = useBalance();
<<<<<<< HEAD
  const { requests, loading: requestsLoading, submitRequest } = useRechargeRequests();
  const navigate = useNavigate();
  const [editUsername, setEditUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeNote, setRechargeNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
=======
  const navigate = useNavigate();
  const [editUsername, setEditUsername] = useState("");
  const [saving, setSaving] = useState(false);
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4

  useEffect(() => {
    if (username) setEditUsername(username);
  }, [username]);

  const handleSave = async () => {
    if (!user || !editUsername.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username: editUsername.trim() })
      .eq("user_id", user.id);
    if (error) {
      toast.error("保存失败");
    } else {
      toast.success("个人信息已更新");
    }
    setSaving(false);
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "topup": return "充值";
      case "deduct": return "扣除";
      case "refund": return "退款";
      default: return type;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "topup": return "text-green-600";
      case "deduct": return "text-destructive";
      case "refund": return "text-blue-600";
      default: return "text-foreground";
    }
  };

<<<<<<< HEAD
  const handleRechargeSubmit = async () => {
    setSubmitting(true);
    const { error } = await submitRequest(Number(rechargeAmount), rechargeNote);
    if (error) toast.error(error);
    else {
      toast.success("充值申请已提交，等待管理员审核通过后到账");
      setRechargeAmount("");
      setRechargeNote("");
    }
    setSubmitting(false);
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "pending": return "待审核";
      case "approved": return "已到账";
      case "rejected": return "已拒绝";
      default: return status;
    }
  };
  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-amber-600";
      case "approved": return "text-green-600";
      case "rejected": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

=======
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">个人中心</h1>
            <p className="text-xs text-muted-foreground">查看和编辑个人信息</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Info */}
        <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> 基本信息
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">用户名</label>
              <input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">邮箱</label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-sm text-muted-foreground border border-border">
                <Mail className="w-4 h-4" />
                {user?.email ?? "—"}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || editUsername.trim() === username}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "保存中..." : "保存修改"}
            </button>
          </div>
        </section>

        {/* Balance */}
        <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" /> 充值余额
          </h2>
          <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3">
            <span className="text-2xl font-bold text-primary">¥{balanceLoading ? "..." : balance}</span>
            <span className="text-xs text-muted-foreground">当前余额</span>
          </div>
<<<<<<< HEAD

          {/* 快捷充值申请 */}
          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">提交充值金额，管理员审核通过后自动到账。</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                min={1}
                placeholder="充值金额（元）"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <input
                type="text"
                placeholder="备注（选填）"
                value={rechargeNote}
                onChange={(e) => setRechargeNote(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <button
                onClick={handleRechargeSubmit}
                disabled={submitting || !rechargeAmount || Number(rechargeAmount) <= 0}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                {submitting ? "提交中…" : "提交充值申请"}
              </button>
            </div>
            {requests.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">充值申请记录</p>
                <div className="space-y-1.5">
                  {requests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between bg-secondary rounded-lg px-3 py-2 text-sm">
                      <span className="font-medium">¥{r.amount}</span>
                      <span className={`${statusColor(r.status)} text-xs`}>{statusLabel(r.status)}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(r.created_at), "MM/dd HH:mm", { locale: zhCN })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
=======
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
        </section>

        {/* Transaction History */}
        <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-primary" /> 余额记录
          </h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">暂无记录</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
                  <div>
                    <span className={`text-sm font-medium ${typeColor(t.type)}`}>
                      {typeLabel(t.type)}
                    </span>
                    {t.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${t.amount > 0 ? "text-green-600" : "text-destructive"}`}>
                      {t.amount > 0 ? "+" : ""}{t.amount}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(t.created_at), "MM/dd HH:mm", { locale: zhCN })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
