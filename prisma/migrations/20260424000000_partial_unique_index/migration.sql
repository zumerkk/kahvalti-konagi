-- DropIndex
DROP INDEX "Reservation_serviceType_date_time_tableId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_active_idx" ON "Reservation"("date", "time", "tableId") WHERE status IN ('PENDING', 'BOOKED', 'CONFIRMED', 'ARRIVED', 'SEATED', 'DEPOSIT_PENDING', 'DEPOSIT_RECEIVED');