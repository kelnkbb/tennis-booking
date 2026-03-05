import { useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingList from "@/components/BookingList";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, CalendarDays, ListChecks, LogOut, User } from "lucide-react";

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const { user, username, signOut } = useAuth();
  const { bookings, addBooking, removeBooking, getBookingsForDate, getUserBookings, isDateFullForUser } =
    useBookings();

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const dateBookings = dateStr ? getBookingsForDate(dateStr) : [];
  const myDateBookings = dateBookings.filter((b) => b.user_id === user?.id);
  const dateFull = dateStr ? isDateFullForUser(dateStr) : false;

  const handleSelectSlot = (time: string) => {
    if (!dateStr) return;
    addBooking(dateStr, time);
  };

  const myBookings = getUserBookings();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">网球场馆预订</h1>
              <p className="text-xs text-muted-foreground">每天最多预订2小时</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {showMyBookings ? (
          /* My Bookings View */
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
            <BookingList bookings={myBookings} onRemove={removeBooking} currentUserId={user?.id} />
          </section>
        ) : (
          <>
            {/* Calendar Section */}
            <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">选择日期</h2>
              </div>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={zhCN}
                  disabled={(date) => {
                    if (date < new Date(new Date().toDateString())) return true;
                    const d = format(date, "yyyy-MM-dd");
                    return isDateFullForUser(d);
                  }}
                  className="rounded-xl"
                />
              </div>
            </section>

            {/* Time Slots */}
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
                    {myDateBookings.length}/2 已选
                  </span>
                )}
              </div>
              <TimeSlotPicker
                selectedDate={dateStr}
                bookedSlots={myDateBookings.map((b) => b.time_slot)}
                allBookedSlots={dateBookings.map((b) => b.time_slot)}
                onSelect={handleSelectSlot}
                isFull={dateFull}
              />
            </section>

            {/* All Bookings */}
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
              <BookingList bookings={bookings} onRemove={removeBooking} currentUserId={user?.id} />
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
