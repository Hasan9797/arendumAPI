/*
  Warnings:

  - The `start_hour` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end_hour` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `start_pause` column on the `OrderPause` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end_pause` column on the `OrderPause` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "start_hour",
ADD COLUMN     "start_hour" BIGINT,
DROP COLUMN "end_hour",
ADD COLUMN     "end_hour" BIGINT;

-- AlterTable
ALTER TABLE "OrderPause" DROP COLUMN "start_pause",
ADD COLUMN     "start_pause" BIGINT,
DROP COLUMN "end_pause",
ADD COLUMN     "end_pause" BIGINT;
