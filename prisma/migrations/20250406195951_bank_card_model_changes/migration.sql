/*
  Warnings:

  - You are about to drop the column `expire` on the `BankCard` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `BankCard` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `BankCard` table. All the data in the column will be lost.
  - Added the required column `card_id` to the `BankCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `card_token` to the `BankCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry` to the `BankCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pan` to the `BankCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankCard" DROP COLUMN "expire",
DROP COLUMN "name",
DROP COLUMN "number",
ADD COLUMN     "balance" INTEGER,
ADD COLUMN     "card_holder" TEXT,
ADD COLUMN     "card_id" TEXT NOT NULL,
ADD COLUMN     "card_token" TEXT NOT NULL,
ADD COLUMN     "expiry" TEXT NOT NULL,
ADD COLUMN     "pan" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;
