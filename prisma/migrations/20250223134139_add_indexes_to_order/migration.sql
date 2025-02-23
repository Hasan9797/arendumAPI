-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_structure_id_idx" ON "Order"("structure_id");

-- CreateIndex
CREATE INDEX "Order_client_id_idx" ON "Order"("client_id");

-- CreateIndex
CREATE INDEX "Order_driver_id_idx" ON "Order"("driver_id");
