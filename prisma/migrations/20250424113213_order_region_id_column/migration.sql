-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "in_work" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "region_id" INTEGER NOT NULL DEFAULT 0;
