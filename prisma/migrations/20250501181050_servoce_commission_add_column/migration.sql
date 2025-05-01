/*
  Warnings:

  - You are about to drop the column `service_amount` on the `ServiceCommission` table. All the data in the column will be lost.
  - Added the required column `arendum_amount` to the `ServiceCommission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceCommission" DROP COLUMN "service_amount",
ADD COLUMN "arendum_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "arendum_percentage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nds_percentage" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Driver_status_idx" ON "Driver"("status");

-- CreateIndex
CREATE INDEX "Driver_is_online_idx" ON "Driver"("is_online");

-- CreateIndex
CREATE INDEX "Driver_in_work_idx" ON "Driver"("in_work");

-- CreateIndex
CREATE INDEX "Driver_machine_id_idx" ON "Driver"("machine_id");
