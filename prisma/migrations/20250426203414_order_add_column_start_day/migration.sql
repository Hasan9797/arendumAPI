-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "start_day" TEXT;

-- CreateIndex
CREATE INDEX "Client_id_idx" ON "Client"("id");

-- CreateIndex
CREATE INDEX "Driver_id_idx" ON "Driver"("id");

-- CreateIndex
CREATE INDEX "MachineParams_id_idx" ON "MachineParams"("id");

-- CreateIndex
CREATE INDEX "MachinePrice_id_idx" ON "MachinePrice"("id");

-- CreateIndex
CREATE INDEX "Machines_id_idx" ON "Machines"("id");

-- CreateIndex
CREATE INDEX "OrderPause_id_idx" ON "OrderPause"("id");

-- CreateIndex
CREATE INDEX "Region_id_idx" ON "Region"("id");

-- CreateIndex
CREATE INDEX "Structure_id_idx" ON "Structure"("id");
