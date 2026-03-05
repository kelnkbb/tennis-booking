import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Shield, ArrowLeft, Users, CalendarDays, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  user_id: string;
  username: string;
  created_at: string;
  email?: string;
  roles: string[];
}

export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { bookings, removeBooking } = useBookings();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "bookings">("users");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");

    if (profiles) {
      const userList: UserProfile[] = profiles.map((p) => ({
        user_id: p.user_id,
        username: p.username,
        created_at: p.created_at,
        roles: roles?.filter((r) => r.user_id === p.user_id).map((r) => r.role) ?? [],
      }));
      setUsers(userList);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`确定要删除用户 "${username}" 吗？该用户的所有预订也会被删除。`)) return;

    // Delete user's bookings first
    await supabase.from("bookings").delete().eq("user_id", userId);
    // Delete user's roles
    await supabase.from("user_roles").delete().eq("user_id", userId);
    // Delete user's profile
    await supabase.from("profiles").delete().eq("user_id", userId);

    toast.success(`用户 "${username}" 已删除`);
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
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
          >
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
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <Users className="w-4 h-4" />
            用户管理
            <span className="text-xs opacity-75">({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "bookings"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            预订管理
            <span className="text-xs opacity-75">({bookings.length})</span>
          </button>
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
                          <p className="text-xs text-muted-foreground">
                            预订: {userBookings.length} 场
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.roles.includes("admin") && (
                          <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
                            管理员
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(u.created_at), "MM/dd", { locale: zhCN })}
                        </span>
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
                    {/* Expanded booking details */}
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
                                <button
                                  onClick={() => removeBooking(booking.id)}
                                  className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
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
                      <div
                        key={booking.id}
                        className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {format(new Date(booking.booking_date + "T00:00:00"), "MM月dd日", { locale: zhCN })}
                              {" "}
                              {booking.time_slot} - {nextHour(booking.time_slot)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              预订人: {booker?.username ?? "未知"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeBooking(booking.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
