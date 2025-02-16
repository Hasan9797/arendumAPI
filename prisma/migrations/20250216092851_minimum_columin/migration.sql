/*
  Warnings:

  - You are about to drop the column `min_hour_time` on the `MachinePrice` table. All the data in the column will be lost.
  - You are about to drop the column `tariff_name` on the `MachinePrice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MachinePrice" DROP COLUMN "min_hour_time",
DROP COLUMN "tariff_name",
ADD COLUMN     "minimum" TEXT;
