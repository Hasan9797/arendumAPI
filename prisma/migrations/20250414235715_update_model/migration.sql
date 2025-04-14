-- DropIndex
DROP INDEX "Structure_region_id_key";

-- DropIndex
DROP INDEX "Transaction_region_id_key";

-- DropIndex
DROP INDEX "Transaction_structure_id_key";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "partner_transaction_id" INTEGER;
