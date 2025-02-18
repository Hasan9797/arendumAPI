/*
  Warnings:

  - The `parameter` column on the `MachinePriceParams` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MachinePrice" ALTER COLUMN "min_amount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MachinePriceParams" DROP COLUMN "parameter",
ADD COLUMN     "parameter" INTEGER;
