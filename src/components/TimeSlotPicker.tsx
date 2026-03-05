import { Check } from "lucide-react";

const TIME_SLOTS = [
  "08:30", "09:30", "10:30", "11:30",
  "12:30", "13:30", "14:30", "15:30",
  "16:30", "17:30", "18:30", "19:30",
];

interface TimeSlotPickerProps {
  selectedDate: string | null;
  bookedSlots: string[];
  onSelect: (time: string) => void;
  isFull: boolean;
}

function formatSlot(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const end = `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return `${time}-${end}`;
}

export default function TimeSlotPicker({
  selectedDate,
  bookedSlots,
  onSelect,
  isFull,
}: TimeSlotPickerProps) {
  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        请先在日历中选择日期
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {TIME_SLOTS.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isDisabled = isFull && !isBooked;

        return (
          <button
            key={slot}
            disabled={isBooked || isDisabled}
            onClick={() => onSelect(slot)}
            className={`
              relative rounded-xl px-3 py-3 text-sm font-medium transition-all
              ${
                isBooked
                  ? "bg-primary/10 text-primary border-2 border-primary/30 cursor-default"
                  : isDisabled
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-card text-foreground border border-border hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
              }
            `}
          >
            {formatSlot(slot)}
            {isBooked && (
              <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
