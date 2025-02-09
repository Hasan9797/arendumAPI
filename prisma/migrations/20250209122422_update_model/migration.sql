/*
  Warnings:

  - You are about to drop the column `caunt` on the `Order` table. All the data in the column will be lost.
  - Added the required column `priceMode` to the `MachinePrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "params" SET DEFAULT '[]';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "caunt",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "end_hour" TIMESTAMP(3),
ADD COLUMN     "hour_count" INTEGER,
ADD COLUMN     "km_count" INTEGER,
ADD COLUMN     "start_hour" TIMESTAMP(3),
ADD COLUMN     "time_is_continue" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "params" SET DEFAULT '[]',
ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "type" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "OrderPause" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "start_pause" TIMESTAMP(3) NOT NULL,
    "end_pause" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderPause_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderPause" ADD CONSTRAINT "OrderPause_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
