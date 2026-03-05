import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Booking {
  id: string;
  user_id: string;
  booking_date: string;
  time_slot: string;
  created_at: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = useCallback(async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date")
      .order("time_slot");
    setBookings(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel("bookings-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchBookings]);

  const addBooking = useCallback(async (date: string, time: string) => {
    if (!user) return;
    // Per-user limit: max 2 slots per day for THIS user
    const userDayBookings = bookings.filter(
      (b) => b.booking_date === date && b.user_id === user.id
    );
    if (userDayBookings.length >= 2) return;

    // Check slot not already taken by anyone
    const slotTaken = bookings.some(
      (b) => b.booking_date === date && b.time_slot === time
    );
    if (slotTaken) return;

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      booking_date: date,
      time_slot: time,
    });
    if (!error) await fetchBookings();
  }, [user, bookings, fetchBookings]);

  const removeBooking = useCallback(async (id: string) => {
    await supabase.from("bookings").delete().eq("id", id);
    await fetchBookings();
  }, [fetchBookings]);

  const getBookingsForDate = useCallback(
    (date: string) => bookings.filter((b) => b.booking_date === date),
    [bookings]
  );

  const getUserBookings = useCallback(
    () => (user ? bookings.filter((b) => b.user_id === user.id) : []),
    [bookings, user]
  );

  // Per-user check: has THIS user booked 2 slots on this date?
  const isDateFullForUser = useCallback(
    (date: string) => {
      if (!user) return false;
      return bookings.filter((b) => b.booking_date === date && b.user_id === user.id).length >= 2;
    },
    [bookings, user]
  );

  return { bookings, loading, addBooking, removeBooking, getBookingsForDate, getUserBookings, isDateFullForUser };
}
