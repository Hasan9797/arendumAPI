/*
  Warnings:

  - The `start_at` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "start_at",
ADD COLUMN     "start_at" BIGINT;
