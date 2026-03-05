import { useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingList from "@/components/BookingList";
import { useBookings } from "@/hooks/useBookings";
import { MapPin, CalendarDays, ListChecks } from "lucide-react";

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { bookings, addBooking, removeBooking, getBookingsForDate, isDateFull } =
    useBookings();

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const dateBookings = dateStr ? getBookingsForDate(dateStr) : [];
  const dateFull = dateStr ? isDateFull(dateStr) : false;

  const handleSelectSlot = (time: string) => {
    if (!dateStr) return;
    addBooking(dateStr, time);
  };

  const disabledDays = (date: Date) => {
    const d = format(date, "yyyy-MM-dd");
    return isDateFull(d);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">网球场馆预订</h1>
            <p className="text-xs text-muted-foreground">每天最多预订2小时</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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
                return disabledDays(date);
              }}
              className="rounded-xl"
            />
          </div>
        </section>

        {/* Time Slots */}
        <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">选择时间段</h2>
            </div>
            {dateStr && (
              <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {format(selectedDate!, "MM月dd日", { locale: zhCN })}
                {" · "}
                {dateBookings.length}/2 已选
              </span>
            )}
          </div>
          <TimeSlotPicker
            selectedDate={dateStr}
            bookedSlots={dateBookings.map((b) => b.time)}
            onSelect={handleSelectSlot}
            isFull={dateFull}
          />
        </section>

        {/* Booking List */}
        <section className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">预订列表</h2>
            {bookings.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {bookings.length}
              </span>
            )}
          </div>
          <BookingList bookings={bookings} onRemove={removeBooking} />
        </section>
      </main>
    </div>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx={12} cy={12} r={10} />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
