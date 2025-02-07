-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "companyInn" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT,
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 1;
