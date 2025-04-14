/*
  Warnings:

  - You are about to drop the `UsersBalance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[machine_id]` on the table `MachinePrice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "service_amount" INTEGER;

-- DropTable
DROP TABLE "UsersBalance";

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER,
    "driver_id" INTEGER,
    "balance" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT,
    "user_phone" TEXT,
    "user_role" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "service_amount" INTEGER,
    "driver_amount" INTEGER,
    "request" JSONB NOT NULL DEFAULT '{"create":{},"preConfirm":{},"confirm":{}}',
    "response" JSONB NOT NULL DEFAULT '{"create":{},"preConfirm":{},"confirm":{}}',
    "type" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balance_client_id_key" ON "Balance"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_driver_id_key" ON "Balance"("driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "MachinePrice_machine_id_key" ON "MachinePrice"("machine_id");

-- CreateIndex
CREATE INDEX "Order_id_idx" ON "Order"("id");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
