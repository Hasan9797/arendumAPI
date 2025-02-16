/*
  Warnings:

  - Added the required column `updated_at` to the `OrderPause` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderPause" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "start_pause" DROP NOT NULL;
