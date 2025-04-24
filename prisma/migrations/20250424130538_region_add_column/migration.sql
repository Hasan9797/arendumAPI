-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "structure_id" DROP NOT NULL,
ALTER COLUMN "structure_id" DROP DEFAULT,
ALTER COLUMN "region_id" DROP NOT NULL,
ALTER COLUMN "region_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
