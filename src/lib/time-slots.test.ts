import { describe, expect, it } from "vitest";

import { getTimeSlots, isAllowedTime, SLOT_MINUTES } from "@/lib/time-slots";
import { isAllowedDate } from "@/lib/reservation-rules";

describe("time slots", () => {
  it("breakfast slots include 08:00 and exclude 14:30", () => {
    const slots = getTimeSlots("BREAKFAST");
    expect(slots[0]).toBe("08:00");
    expect(slots[slots.length - 1]).toBe("13:30");
    expect(isAllowedTime("BREAKFAST", "13:30")).toBe(true);
    expect(isAllowedTime("BREAKFAST", "14:30")).toBe(false);
    expect(SLOT_MINUTES).toBe(30);
  });

  it("cafe slots include 14:00 and exclude 23:30", () => {
    const slots = getTimeSlots("CAFE");
    expect(slots[0]).toBe("14:00");
    expect(slots[slots.length - 1]).toBe("22:30");
    expect(isAllowedTime("CAFE", "22:30")).toBe(true);
    expect(isAllowedTime("CAFE", "23:30")).toBe(false);
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
