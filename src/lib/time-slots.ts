import { addMinutes, format, parse, isBefore, isAfter, isEqual } from "date-fns";
import type { ServiceType } from "@/lib/services";

export const SLOT_MINUTES = 30 as const;
export const RESERVATION_DURATION_MINUTES = 120 as const;

export function serviceWindow(service: ServiceType) {
  return service === "BREAKFAST"
    ? { openFrom: "08:00", openTo: "14:00" }
    : { openFrom: "14:00", openTo: "23:00" };
}

export function getTimeSlots(service: ServiceType) {
  const { openFrom, openTo } = serviceWindow(service);
  const start = parse(openFrom, "HH:mm", new Date(0));
  const end = parse(openTo, "HH:mm", new Date(0));

  const slots: string[] = [];
  let cur = start;
  // son slot başlangıcı: end - SLOT_MINUTES
  while (addMinutes(cur, SLOT_MINUTES) <= end) {
    slots.push(format(cur, "HH:mm"));
    cur = addMinutes(cur, SLOT_MINUTES);
  }
  return slots;
}

export function isAllowedTime(service: ServiceType, time: string) {
  return getTimeSlots(service).includes(time);
}

export function isTimeOverlap(time1: string, time2: string): boolean {
  const t1 = parse(time1, "HH:mm", new Date(0));
  const t2 = parse(time2, "HH:mm", new Date(0));
  
  const t1End = addMinutes(t1, RESERVATION_DURATION_MINUTES);
  const t2End = addMinutes(t2, RESERVATION_DURATION_MINUTES);

  return (isBefore(t1, t2End) && isAfter(t1End, t2));
}

