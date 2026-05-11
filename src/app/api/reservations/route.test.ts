import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    closedDate: { findUnique: vi.fn() },
    reservation: { findFirst: vi.fn(), create: vi.fn() },
    settings: { findUnique: vi.fn() },
  },
}));

vi.mock("@/lib/audit-logger", () => ({
  logAudit: vi.fn(),
}));

describe("Reservations API - Integration Scenarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    serviceType: "BREAKFAST",
    date: "2026-04-24",
    time: "08:00",
    areaId: "area1",
    tableId: "table1",
    fullName: "Ahmet Yılmaz",
    phone: "05554443322",
    tckn: "12345678901",
    partySize: 2,
    note: "Pencere kenarı lütfen",
  };

  it("Scenario 1: Creates reservation successfully", async () => {
    // Mock settings
    vi.mocked(prisma.settings.findUnique).mockResolvedValue({
      onlineReservationsActive: true,
      maxPartySize: 4,
      breakfastPricePerPerson: 350,
    } as any);

    // Mock no closed dates
    vi.mocked(prisma.closedDate.findUnique).mockResolvedValue(null);

    // Mock no overlapping reservations
    vi.mocked(prisma.reservation.findFirst).mockResolvedValue(null);

    // Mock successful creation
    vi.mocked(prisma.reservation.create).mockResolvedValue({
      id: "res123",
      table: { name: "Masa 1" },
    } as any);

    const req = new Request("http://localhost/api/reservations", {
      method: "POST",
      headers: { "x-forwarded-for": "127.0.0.1" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.reservation.id).toBe("res123");
  });

  it("Scenario 2: Prevents Double-Booking / Overlap", async () => {
    vi.mocked(prisma.settings.findUnique).mockResolvedValue({
      onlineReservationsActive: true,
      maxPartySize: 4,
    } as any);

    vi.mocked(prisma.closedDate.findUnique).mockResolvedValue(null);

    // Mock an overlapping reservation at 09:00 (which overlaps with 08:00)
    vi.mocked(prisma.reservation.findFirst).mockResolvedValue({
      time: "09:00",
    } as any);

    const req = new Request("http://localhost/api/reservations", {
      method: "POST",
      headers: { "x-forwarded-for": "127.0.0.2" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.ok).toBe(false);
    expect(json.error).toContain("aynı saatte başkası tarafından rezerve edilmiş");
  });

  it("Scenario 3: Rate Limiting Blocks Excessive Requests", async () => {
    // Send 6 requests from the same IP
    const ip = "192.168.1.100";
    
    let lastStatus = 200;
    for (let i = 0; i < 6; i++) {
      const req = new Request("http://localhost/api/reservations", {
        method: "POST",
        headers: { "x-forwarded-for": ip },
        body: JSON.stringify(validPayload),
      });
      const res = await POST(req);
      lastStatus = res.status;
    }

    expect(lastStatus).toBe(429); // The 6th request should be blocked
  });
});
