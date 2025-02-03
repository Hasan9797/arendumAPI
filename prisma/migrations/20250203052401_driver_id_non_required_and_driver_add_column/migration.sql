-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_driver_id_fkey";

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "company_name" TEXT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "driver_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
