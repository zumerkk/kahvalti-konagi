import { addMinutes, format, isWeekend, parse } from "date-fns";

export const RESERVATION = {
  // Hafta sonu (Cumartesi/Pazar) açık
  weekendOnly: true,
  openFrom: "08:00",
  openTo: "14:00", // kapanış (son slot bundan önce biter)
  slotMinutes: 30,
} as const;

export function isAllowedDate(dateStr: string) {
  const d = parse(dateStr, "yyyy-MM-dd", new Date());
  if (Number.isNaN(d.getTime())) return false;
  if (RESERVATION.weekendOnly && !isWeekend(d)) return false;
  return true;
}

export function getTimeSlots() {
  const start = parse(RESERVATION.openFrom, "HH:mm", new Date(0));
  const end = parse(RESERVATION.openTo, "HH:mm", new Date(0));

  const slots: string[] = [];
  let cur = start;
  // son slot başlangıcı: end - slotMinutes
  while (addMinutes(cur, RESERVATION.slotMinutes) <= end) {
    slots.push(format(cur, "HH:mm"));
    cur = addMinutes(cur, RESERVATION.slotMinutes);
  }
  return slots;
}

export function isAllowedTime(time: string) {
  return getTimeSlots().includes(time);
}

export function toDbDate(dateStr: string) {
  // @db.Date için güvenli: UTC midnight
  return new Date(`${dateStr}T00:00:00.000Z`);
}

