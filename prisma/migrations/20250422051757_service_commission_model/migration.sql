-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "comment" TEXT;

-- CreateTable
CREATE TABLE "ServiceCommission" (
    "id" SERIAL NOT NULL,
    "nds_amount" INTEGER NOT NULL,
    "service_amount" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "driver_balance" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCommission_pkey" PRIMARY KEY ("id")
);
