/*
  Warnings:

  - You are about to drop the column `partner_transaction_id` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
-- AlterTable
ALTER TABLE "Transaction" 
ADD COLUMN "partner_id" INTEGER;

