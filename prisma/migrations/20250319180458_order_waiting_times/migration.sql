/*
  Warnings:

  - Added the required column `number` to the `BankCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankCard" ADD COLUMN     "number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "driver_arrived_time" TEXT,
ADD COLUMN     "paid_waiting_amount" INTEGER,
ADD COLUMN     "paid_waiting_time" TEXT;

-- CreateTable
CREATE TABLE "UsersBalance" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" TEXT NOT NULL,

    CONSTRAINT "UsersBalance_pkey" PRIMARY KEY ("id")
);
