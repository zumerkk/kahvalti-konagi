import { describe, expect, it } from "vitest";

import { getTimeSlots, isAllowedTime, isTimeOverlap, SLOT_MINUTES, RESERVATION_DURATION_MINUTES } from "@/lib/time-slots";
import { isAllowedDate } from "@/lib/reservation-rules";

describe("time slots", () => {
  it("breakfast slots include 08:00 and exclude 15:30", () => {
    const slots = getTimeSlots("BREAKFAST");
    expect(slots[0]).toBe("08:00");
    expect(slots[slots.length - 1]).toBe("14:30");
    expect(isAllowedTime("BREAKFAST", "14:30")).toBe(true);
    expect(isAllowedTime("BREAKFAST", "15:30")).toBe(false);
    expect(SLOT_MINUTES).toBe(30);
  });

  it("cafe slots include 15:00 and exclude 23:30", () => {
    const slots = getTimeSlots("CAFE");
    expect(slots[0]).toBe("15:00");
    expect(slots[slots.length - 1]).toBe("22:30");
    expect(isAllowedTime("CAFE", "22:30")).toBe(true);
    expect(isAllowedTime("CAFE", "23:30")).toBe(false);
  });
});

describe("overlap logic", () => {
  it("detects overlaps correctly for a 2-hour duration", () => {
    expect(RESERVATION_DURATION_MINUTES).toBe(120);

    // 08:00 - 10:00 vs 09:00 - 11:00 -> Overlap
    expect(isTimeOverlap("08:00", "09:00")).toBe(true);
    
    // 08:00 - 10:00 vs 09:30 - 11:30 -> Overlap
    expect(isTimeOverlap("08:00", "09:30")).toBe(true);

    // 08:00 - 10:00 vs 10:00 - 12:00 -> No Overlap
    expect(isTimeOverlap("08:00", "10:00")).toBe(false);

    // 10:00 - 12:00 vs 08:00 - 10:00 -> No Overlap
    expect(isTimeOverlap("10:00", "08:00")).toBe(false);
  });
});

describe("date validation", () => {
  it("accepts valid YYYY-MM-DD dates", () => {
    expect(isAllowedDate("2026-04-23")).toBe(true);
  });

  it("rejects invalid dates", () => {
    expect(isAllowedDate("not-a-date")).toBe(false);
    expect(isAllowedDate("2026-02-30")).toBe(false);
  });
});
