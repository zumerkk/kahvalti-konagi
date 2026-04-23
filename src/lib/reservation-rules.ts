import { parse } from "date-fns";
import type { ServiceType } from "@/lib/services";
import {
  getTimeSlots as getServiceTimeSlots,
  isAllowedTime as isAllowedServiceTime,
} from "@/lib/time-slots";

export function isAllowedDate(dateStr: string) {
  const d = parse(dateStr, "yyyy-MM-dd", new Date());
  if (Number.isNaN(d.getTime())) return false;
  return true;
}

export function getTimeSlots(service: ServiceType) {
  return getServiceTimeSlots(service);
}

export function isAllowedTime(service: ServiceType, time: string) {
  return isAllowedServiceTime(service, time);
}

export function toDbDate(dateStr: string) {
  // @db.Date için güvenli: UTC midnight
  return new Date(`${dateStr}T00:00:00.000Z`);
}
