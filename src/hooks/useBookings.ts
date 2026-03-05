import { useState, useEffect, useCallback } from "react";

export interface Booking {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:30"
}

const STORAGE_KEY = "tennis-court-bookings";

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(loadBookings);

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  const addBooking = useCallback((date: string, time: string) => {
    setBookings((prev) => {
      const dateBookings = prev.filter((b) => b.date === date);
      if (dateBookings.length >= 2) return prev;
      if (prev.some((b) => b.date === date && b.time === time)) return prev;
      return [...prev, { id: crypto.randomUUID(), date, time }];
    });
  }, []);

  const removeBooking = useCallback((id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getBookingsForDate = useCallback(
    (date: string) => bookings.filter((b) => b.date === date),
    [bookings]
  );

  const isDateFull = useCallback(
    (date: string) => bookings.filter((b) => b.date === date).length >= 2,
    [bookings]
  );

  return { bookings, addBooking, removeBooking, getBookingsForDate, isDateFull };
}
