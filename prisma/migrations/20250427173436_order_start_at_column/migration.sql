/*
  Warnings:

  - You are about to drop the column `start_day` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "start_day",
ADD COLUMN     "start_at" TEXT;
