import { useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingList from "@/components/BookingList";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ListChecks, LogOut, User, Shield, Send } from "lucide-react";
import AnnouncementDialog from "@/components/AnnouncementDialog";
import PostBookingDialog from "@/components/PostBookingDialog";
import { toast } from "sonner";

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPostBooking, setShowPostBooking] = useState(false);
  const { user, username, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { bookings, addBooking, removeBooking, getBookingsForDate, getUserBookings, isDateFullyBooked } =
    useBookings();

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const dateBookings = dateStr ? getBookingsForDate(dateStr) : [];
  const myDateBookings = dateBookings.filter((b) => b.user_id === user?.id);
  const dateFull = dateStr ? isDateFullyBooked(dateStr) : false;

  const handleToggleSlot = (time: string) => {
    setSelectedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = async () => {
    if (!dateStr || selectedSlots.length === 0) return;
    setSubmitting(true);
    for (const slot of selectedSlots) {
      await addBooking(dateStr, slot);
    }
    setSelectedSlots([]);
    setSubmitting(false);
    toast.success(`成功预订 ${selectedSlots.length} 个时段！`);
    setShowPostBooking(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlots([]);
  };

  const myBookings = getUserBookings();

  return (
    <div className="min-h-screen bg-background">
      {/* Tennis ball pattern background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-[6px] border-foreground" />
        <div className="absolute top-40 right-20 w-20 h-20 rounded-full border-[4px] border-foreground" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full border-[5px] border-foreground" />
        <div className="absolute bottom-40 right-1/3 w-16 h-16 rounded-full border-[3px] border-foreground" />
      </div>

      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="text-lg">🎾</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">网球场馆预订</h1>
              <p className="text-xs text-muted-foreground">每天总计最多预订2小时</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-accent text-accent-foreground hover:opacity-90 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                管理
              </button>
            )}
            <button
              onClick={() => setShowMyBookings(!showMyBookings)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                showMyBookings
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              {username ?? "我"}
            </button>
            <button
              onClick={signOut}
              className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
              aria-label="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <AnnouncementDialog />
      <PostBookingDialog open={showPostBooking} onClose={() => setShowPostBooking(false)} />
      <main className="relative max-w-4xl mx-auto px-4 py-6 space-y-6">
        {showMyBookings ? (
          <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">我的预订</h2>
              {myBookings.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {myBookings.length}
                </span>
              )}
            </div>
            <BookingList bookings={myBookings} onRemove={removeBooking} currentUserId={user?.id} isAdmin={isAdmin} />
          </section>
        ) : (
          <>
            <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">选择日期</h2>
              </div>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  locale={zhCN}
                  disabled={(date) => {
                    if (date < new Date(new Date().toDateString())) return true;
                    const d = format(date, "yyyy-MM-dd");
                    return isDateFullyBooked(d);
                  }}
                  className="rounded-xl"
                />
              </div>
            </section>

            <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">选择时间段</h2>
                </div>
                {dateStr && (
                  <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {format(selectedDate!, "MM月dd日", { locale: zhCN })}
                    {" · "}
                    {dateBookings.length}/2 已被预订
                  </span>
                )}
              </div>
              <TimeSlotPicker
                selectedDate={dateStr}
                bookedSlots={myDateBookings.map((b) => b.time_slot)}
                allBookedSlots={dateBookings.map((b) => b.time_slot)}
                selectedSlots={selectedSlots}
                onToggleSlot={handleToggleSlot}
                isFull={dateFull}
              />

              {/* Submit button */}
              {selectedSlots.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "提交中..." : `提交预订 (${selectedSlots.length}个时段)`}
                  </button>
                </div>
              )}
            </section>

            <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">全部预订</h2>
                {bookings.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {bookings.length}
                  </span>
                )}
              </div>
              <BookingList bookings={bookings} onRemove={removeBooking} currentUserId={user?.id} isAdmin={isAdmin} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx={12} cy={12} r={10} />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
