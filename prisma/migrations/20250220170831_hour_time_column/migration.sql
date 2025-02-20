/*
  Warnings:

  - Made the column `start_pause` on table `OrderPause` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "total_pause_hour" INTEGER,
ADD COLUMN     "total_pause_minut" INTEGER,
ADD COLUMN     "total_work_hour" INTEGER,
ADD COLUMN     "total_work_minut" INTEGER;

-- AlterTable
ALTER TABLE "OrderPause" ADD COLUMN     "total_time" BIGINT,
ALTER COLUMN "status" SET DEFAULT true,
ALTER COLUMN "start_pause" SET NOT NULL;
