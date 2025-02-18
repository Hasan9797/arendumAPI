/*
  Warnings:

  - The `minimum` column on the `MachinePrice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `min_amount` on the `MachinePrice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MachinePrice" DROP COLUMN "min_amount",
ADD COLUMN     "min_amount" INTEGER NOT NULL,
DROP COLUMN "minimum",
ADD COLUMN     "minimum" INTEGER;
