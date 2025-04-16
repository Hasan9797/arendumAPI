/*
  Warnings:

  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[region_id]` on the table `Structure` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[region_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structure_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_name` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_phone` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
*/

-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_client_id_fkey";
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_driver_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "region_id" INTEGER,
ADD COLUMN "structure_id" INTEGER,
ALTER COLUMN "user_name" SET NOT NULL,
ALTER COLUMN "user_phone" SET NOT NULL;

-- DropTable
DROP TABLE "Balance"; -- Eski jadvalni o'chirish

-- CreateTable
CREATE TABLE "UserBalance" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER,
    "driver_id" INTEGER,
    "balance" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_client_id_key" ON "UserBalance"("client_id");
CREATE UNIQUE INDEX "UserBalance_driver_id_key" ON "UserBalance"("driver_id");

-- CreateIndex for Structure table
CREATE UNIQUE INDEX "Structure_region_id_key" ON "Structure"("region_id");

-- CreateIndex for Transaction table
CREATE UNIQUE INDEX "Transaction_region_id_key" ON "Transaction"("region_id");
CREATE UNIQUE INDEX "Transaction_structure_id_key" ON "Transaction"("structure_id");

-- Create Indexes for Transaction table
CREATE INDEX "Transaction_id_idx" ON "Transaction"("id");
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");
CREATE INDEX "Transaction_user_id_idx" ON "Transaction"("user_id");
CREATE INDEX "Transaction_user_name_idx" ON "Transaction"("user_name");
CREATE INDEX "Transaction_user_role_idx" ON "Transaction"("user_role");
CREATE INDEX "Transaction_created_at_idx" ON "Transaction"("created_at");

-- AddForeignKey for UserBalance
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey for Transaction table
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
