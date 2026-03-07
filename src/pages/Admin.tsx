import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
<<<<<<< HEAD
import { Shield, ArrowLeft, Users, CalendarDays, Trash2, ChevronDown, ChevronUp, Wallet, Plus, RotateCcw, CheckCircle, XCircle } from "lucide-react";
=======
import { Shield, ArrowLeft, Users, CalendarDays, Trash2, ChevronDown, ChevronUp, Wallet, Plus, RotateCcw } from "lucide-react";
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
import { toast } from "sonner";

interface UserProfile {
  user_id: string;
  username: string;
  created_at: string;
  roles: string[];
  balance: number;
}

<<<<<<< HEAD
interface RechargeRequestRow {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  note: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

=======
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { bookings, removeBooking } = useBookings();
  const [users, setUsers] = useState<UserProfile[]>([]);
<<<<<<< HEAD
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequestRow[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "bookings" | "recharge">("users");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [topupUserId, setTopupUserId] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
=======
  const [activeTab, setActiveTab] = useState<"users" | "bookings">("users");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [topupUserId, setTopupUserId] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState("");
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/");
  }, [isAdmin, authLoading, navigate]);

  const fetchUsers = async () => {
    const [profilesRes, rolesRes, balancesRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("user_roles").select("*"),
      supabase.from("balances").select("*"),
    ]);
    const profiles = profilesRes.data ?? [];
    const roles = rolesRes.data ?? [];
    const balances = balancesRes.data ?? [];

    const userList: UserProfile[] = profiles.map((p) => ({
      user_id: p.user_id,
      username: p.username,
      created_at: p.created_at,
      roles: roles.filter((r) => r.user_id === p.user_id).map((r) => r.role),
      balance: balances.find((b) => b.user_id === p.user_id)?.amount ?? 0,
    }));
    setUsers(userList);
  };

<<<<<<< HEAD
  const fetchRechargeRequests = async () => {
    const { data } = await supabase
      .from("recharge_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRechargeRequests((data as RechargeRequestRow[]) ?? []);
  };

=======
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

<<<<<<< HEAD
  useEffect(() => {
    if (isAdmin && activeTab === "recharge") fetchRechargeRequests();
  }, [isAdmin, activeTab]);

=======
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`确定要删除用户 "${username}" 吗？`)) return;
    await supabase.from("bookings").delete().eq("user_id", userId);
    await supabase.from("balance_transactions").delete().eq("user_id", userId);
    await supabase.from("balances").delete().eq("user_id", userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("user_id", userId);
    toast.success(`用户 "${username}" 已删除`);
    await fetchUsers();
  };

  const handleTopup = async (userId: string) => {
    const amount = parseInt(topupAmount);
    if (!amount || amount <= 0) { toast.error("请输入有效金额"); return; }
    
    const targetUser = users.find(u => u.user_id === userId);
    // Update balance
    const { error: updateErr } = await supabase
      .from("balances")
      .update({ amount: (targetUser?.balance ?? 0) + amount, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
    
    if (updateErr) { toast.error("充值失败"); return; }

    // Log transaction
    await supabase.from("balance_transactions").insert({
      user_id: userId,
      amount: amount,
      type: "topup",
      description: `管理员充值 ¥${amount}`,
      created_by: user?.id,
    });

    toast.success(`已为 ${targetUser?.username} 充值 ¥${amount}`);
    setTopupUserId(null);
    setTopupAmount("");
    await fetchUsers();
  };

<<<<<<< HEAD
  const handleApproveRecharge = async (req: RechargeRequestRow) => {
    setReviewingId(req.id);
    const targetUser = users.find((u) => u.user_id === req.user_id);
    const { data: balanceRow } = await supabase
      .from("balances")
      .select("amount")
      .eq("user_id", req.user_id)
      .single();
    const currentBalance = balanceRow?.amount ?? 0;
    const { error: updateErr } = await supabase
      .from("balances")
      .update({
        amount: currentBalance + req.amount,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", req.user_id);
    if (updateErr) {
      toast.error("充值到账失败");
      setReviewingId(null);
      return;
    }
    await supabase.from("balance_transactions").insert({
      user_id: req.user_id,
      amount: req.amount,
      type: "topup",
      description: `管理员审核通过充值申请 ¥${req.amount}`,
      created_by: user?.id,
    });
    await supabase
      .from("recharge_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq("id", req.id);
    toast.success(`已为 ${targetUser?.username ?? "用户"} 到账 ¥${req.amount}`);
    setReviewingId(null);
    await fetchUsers();
    await fetchRechargeRequests();
  };

  const handleRejectRecharge = async (req: RechargeRequestRow) => {
    setReviewingId(req.id);
    await supabase
      .from("recharge_requests")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq("id", req.id);
    toast.success("已拒绝该充值申请");
    setReviewingId(null);
    await fetchRechargeRequests();
  };

=======
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
  const handleRefund = async (userId: string, bookingId: string) => {
    const targetUser = users.find(u => u.user_id === userId);
    // Refund 60
    const { error } = await supabase
      .from("balances")
      .update({ amount: (targetUser?.balance ?? 0) + 60, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
    
    if (error) { toast.error("退款失败"); return; }

    await supabase.from("balance_transactions").insert({
      user_id: userId,
      amount: 60,
      type: "refund",
      description: "管理员退还预订费用 ¥60",
      created_by: user?.id,
    });

    // Delete the booking
    await removeBooking(bookingId);
    toast.success(`已退还 ¥60 给 ${targetUser?.username}`);
    await fetchUsers();
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">加载中...</div>;
  if (!isAdmin) return null;

  const bookingsByUser = bookings.reduce<Record<string, typeof bookings>>((acc, b) => {
    (acc[b.user_id] ||= []).push(b);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">🎾 管理后台</h1>
            <p className="text-xs text-muted-foreground">管理用户和预订</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
<<<<<<< HEAD
        <div className="flex flex-wrap gap-2">
          {[
            { key: "users" as const, label: "用户管理", icon: Users, count: users.length },
            { key: "bookings" as const, label: "预订管理", icon: CalendarDays, count: bookings.length },
            { key: "recharge" as const, label: "充值申请", icon: Wallet, count: rechargeRequests.filter((r) => r.status === "pending").length },
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
=======
        <div className="flex gap-2">
          {(["users", "bookings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
<<<<<<< HEAD
              <Icon className="w-4 h-4" />
              {label}
              <span className="text-xs opacity-75">({count})</span>
=======
              {tab === "users" ? <Users className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
              {tab === "users" ? "用户管理" : "预订管理"}
              <span className="text-xs opacity-75">({tab === "users" ? users.length : bookings.length})</span>
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
            <div className="space-y-3">
              {users.map((u) => {
                const userBookings = bookingsByUser[u.user_id] ?? [];
                const isExpanded = expandedUser === u.user_id;
                return (
                  <div key={u.user_id} className="bg-secondary rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{u.username}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>预订: {userBookings.length}</span>
                            <span className="flex items-center gap-0.5">
                              <Wallet className="w-3 h-3" /> ¥{u.balance}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {u.roles.includes("admin") && (
                          <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">管理员</span>
                        )}
                        {/* Topup button */}
                        <button
                          onClick={() => { setTopupUserId(topupUserId === u.user_id ? null : u.user_id); setTopupAmount(""); }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-green-600 hover:bg-green-500/10 transition-colors"
                          title="充值"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        {userBookings.length > 0 && (
                          <button
                            onClick={() => setExpandedUser(isExpanded ? null : u.user_id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        )}
                        {!u.roles.includes("admin") && (
                          <button
                            onClick={() => handleDeleteUser(u.user_id, u.username)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Topup input */}
                    {topupUserId === u.user_id && (
                      <div className="px-4 pb-3 pt-1 border-t border-border/50 flex gap-2">
                        <input
                          type="number"
                          placeholder="充值金额"
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-background text-sm border border-border focus:border-primary focus:outline-none"
                        />
                        <button
                          onClick={() => handleTopup(u.user_id)}
                          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                        >
                          充值
                        </button>
                      </div>
                    )}

                    {/* Expanded bookings */}
                    {isExpanded && userBookings.length > 0 && (
                      <div className="px-4 pb-3 pt-1 border-t border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-2">预订记录：</p>
                        <div className="space-y-1.5">
                          {userBookings
                            .sort((a, b) => a.booking_date.localeCompare(b.booking_date) || a.time_slot.localeCompare(b.time_slot))
                            .map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between bg-background/60 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  <span className="text-xs text-foreground">
                                    {format(new Date(booking.booking_date + "T00:00:00"), "MM月dd日", { locale: zhCN })}
                                    {" "}
                                    {booking.time_slot} - {nextHour(booking.time_slot)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleRefund(u.user_id, booking.id)}
                                    className="p-1 rounded text-muted-foreground hover:text-blue-600 transition-colors"
                                    title="退款 ¥60"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => removeBooking(booking.id)}
                                    className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

<<<<<<< HEAD
        {activeTab === "recharge" && (
          <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
            <p className="text-sm text-muted-foreground mb-4">用户提交的充值申请，通过后金额将自动到账。</p>
            {rechargeRequests.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">暂无充值申请</p>
            ) : (
              <div className="space-y-3">
                {rechargeRequests.map((req) => {
                  const u = users.find((x) => x.user_id === req.user_id);
                  const isPending = req.status === "pending";
                  const busy = reviewingId === req.id;
                  return (
                    <div
                      key={req.id}
                      className={`flex items-center justify-between bg-secondary rounded-xl px-4 py-3 ${!isPending ? "opacity-75" : ""}`}
                    >
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {u?.username ?? req.user_id} · ¥{req.amount}
                        </p>
                        {req.note && (
                          <p className="text-xs text-muted-foreground mt-0.5">{req.note}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(req.created_at), "yyyy-MM-dd HH:mm", { locale: zhCN })}
                          {req.status !== "pending" && (
                            <span className="ml-2">
                              {req.status === "approved" ? "已通过" : "已拒绝"}
                            </span>
                          )}
                        </p>
                      </div>
                      {isPending && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleApproveRecharge(req)}
                            disabled={busy}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-500/15 transition-colors disabled:opacity-50"
                            title="通过并到账"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectRecharge(req)}
                            disabled={busy}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                            title="拒绝"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

=======
>>>>>>> 2896ede36f47027c152f24aec5d626dd767fd7b4
        {activeTab === "bookings" && (
          <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
            {bookings.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">暂无预订</p>
            ) : (
              <div className="space-y-3">
                {bookings
                  .sort((a, b) => a.booking_date.localeCompare(b.booking_date) || a.time_slot.localeCompare(b.time_slot))
                  .map((booking) => {
                    const booker = users.find((u) => u.user_id === booking.user_id);
                    return (
                      <div key={booking.id} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {format(new Date(booking.booking_date + "T00:00:00"), "MM月dd日", { locale: zhCN })}
                              {" "}
                              {booking.time_slot} - {nextHour(booking.time_slot)}
                            </p>
                            <p className="text-xs text-muted-foreground">预订人: {booker?.username ?? "未知"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRefund(booking.user_id, booking.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-colors"
                            title="退款 ¥60 并删除"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeBooking(booking.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function nextHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
