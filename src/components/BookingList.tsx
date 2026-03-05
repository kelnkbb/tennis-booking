import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { X, Clock } from "lucide-react";
import type { Booking } from "@/hooks/useBookings";

interface BookingListProps {
  bookings: Booking[];
  onRemove: (id: string) => void;
}

export default function BookingList({ bookings, onRemove }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">暂无预订记录</p>
        <p className="text-xs mt-1">选择日期和时间段来预订场地</p>
      </div>
    );
  }

  // Group by date
  const grouped = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    (acc[b.date] ||= []).push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => (
        <div key={date}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {format(new Date(date), "MM月dd日 EEEE", { locale: zhCN })}
          </h4>
          <div className="space-y-2">
            {grouped[date]
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3 shadow-sm group transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium text-sm text-foreground">
                      {booking.time} - {nextHour(booking.time)}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemove(booking.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="删除"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function nextHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const next = h + 1;
  return `${String(next).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
