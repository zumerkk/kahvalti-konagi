import { describe, expect, it } from "vitest";

// TS path alias smoke test: "@/..." import’ları çalışmalı
import { getTimeSlots, RESERVATION } from "@/lib/reservation-rules";

describe("time slots (smoke)", () => {
  it("runs and generates slots", () => {
    const slots = getTimeSlots();
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toBe(RESERVATION.openFrom);
  });
});

