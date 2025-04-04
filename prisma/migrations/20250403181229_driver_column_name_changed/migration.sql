/*
  Warnings:

  - You are about to drop the column `companyInn` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "companyInn",
ADD COLUMN     "company_inn" TEXT;
