/*
  Warnings:

  - You are about to drop the column `user_id` on the `BankCard` table. All the data in the column will be lost.
  - Changed the type of `card_id` on the `BankCard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BankCard" DROP COLUMN "user_id",
ADD COLUMN     "client_id" INTEGER,
ADD COLUMN     "driver_id" INTEGER,
DROP COLUMN "card_id",
ADD COLUMN     "card_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BankCard" ADD CONSTRAINT "BankCard_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankCard" ADD CONSTRAINT "BankCard_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
