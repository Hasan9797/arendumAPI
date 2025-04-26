/*
  Warnings:

  - You are about to drop the column `amount_type` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "amount_type",
ADD COLUMN     "payment_type" INTEGER NOT NULL DEFAULT 1;
