-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "pinfl" TEXT;

-- AlterTable
ALTER TABLE "Machines" ALTER COLUMN "status" SET DEFAULT 1;
