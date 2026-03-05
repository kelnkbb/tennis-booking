import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { X, Clock } from "lucide-react";
import type { Booking } from "@/hooks/useBookings";

// username is optionally available on Booking

interface BookingListProps {
  bookings: Booking[];
  onRemove: (id: string) => void;
  currentUserId?: string;
  isAdmin?: boolean;
}

export default function BookingList({ bookings, onRemove, currentUserId, isAdmin }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">暂无预订记录</p>
        <p className="text-xs mt-1">选择日期和时间段来预订场地</p>
      </div>
    );
  }

  const grouped = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    (acc[b.booking_date] ||= []).push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => (
        <div key={date}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {format(new Date(date + "T00:00:00"), "MM月dd日 EEEE", { locale: zhCN })}
          </h4>
          <div className="space-y-2">
            {grouped[date]
              .sort((a, b) => a.time_slot.localeCompare(b.time_slot))
              .map((booking) => {
                const isMine = booking.user_id === currentUserId;
                const canDelete = isMine || isAdmin;
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isMine ? "bg-primary" : "bg-muted-foreground"}`} />
                      <span className="font-medium text-sm text-foreground">
                        {booking.time_slot} - {nextHour(booking.time_slot)}
                      </span>
                      {!isMine && (
                        <span className="text-xs text-muted-foreground">已预订</span>
                      )}
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => onRemove(booking.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label="删除"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

function nextHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
