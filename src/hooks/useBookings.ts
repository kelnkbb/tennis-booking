import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Booking {
  id: string;
  user_id: string;
  booking_date: string;
  time_slot: string;
  created_at: string;
  username?: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = useCallback(async () => {
    const [bookingsRes, profilesRes] = await Promise.all([
      supabase.from("bookings").select("*").order("booking_date").order("time_slot"),
      supabase.from("profiles").select("user_id, username"),
    ]);
    const profiles = profilesRes.data ?? [];
    const usernameMap = Object.fromEntries(profiles.map((p) => [p.user_id, p.username]));
    const enriched = (bookingsRes.data ?? []).map((b) => ({
      ...b,
      username: usernameMap[b.user_id] ?? "未知",
    }));
    setBookings(enriched);
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

    // Global daily limit: all users combined max 2 bookings per day
    const dayBookings = bookings.filter((b) => b.booking_date === date);
    if (dayBookings.length >= 2) return;

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

  // Global check: has this date reached 2 total bookings?
  const isDateFullyBooked = useCallback(
    (date: string) => bookings.filter((b) => b.booking_date === date).length >= 2,
    [bookings]
  );

  return { bookings, loading, addBooking, removeBooking, getBookingsForDate, getUserBookings, isDateFullyBooked };
}
