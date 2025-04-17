/*
  Warnings:

  - You are about to drop the column `driver_amount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `region_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `service_amount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_phone` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_role` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_region_id_fkey";

-- DropIndex
DROP INDEX "Transaction_user_id_idx";

-- DropIndex
DROP INDEX "Transaction_user_name_idx";

-- DropIndex
DROP INDEX "Transaction_user_role_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "driver_amount",
DROP COLUMN "region_id",
DROP COLUMN "service_amount",
DROP COLUMN "user_id",
DROP COLUMN "user_name",
DROP COLUMN "user_phone",
DROP COLUMN "user_role",
ADD COLUMN     "card_id" INTEGER,
ADD COLUMN     "card_token" TEXT,
ADD COLUMN     "client_id" INTEGER,
ADD COLUMN     "commission" TEXT,
ADD COLUMN     "confirm_time" TEXT,
ADD COLUMN     "confirmed" BOOLEAN,
ADD COLUMN     "currency" TEXT DEFAULT 'UZS',
ADD COLUMN     "deposit_amount" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "driver_id" INTEGER,
ADD COLUMN     "invoice" INTEGER,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "pan" TEXT,
ADD COLUMN     "prepay_time" TEXT,
ADD COLUMN     "state" INTEGER,
ALTER COLUMN "request" DROP NOT NULL,
ALTER COLUMN "request" DROP DEFAULT,
ALTER COLUMN "response" DROP NOT NULL,
ALTER COLUMN "response" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Transaction_structure_id_idx" ON "Transaction"("structure_id");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
