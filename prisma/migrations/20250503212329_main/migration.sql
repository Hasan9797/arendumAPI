-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "img" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "phone" TEXT NOT NULL,
    "machine_id" INTEGER,
    "email" TEXT,
    "img" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "photo_tex_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_license" JSONB NOT NULL DEFAULT '[]',
    "photo_confidence_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_driver_license" JSONB NOT NULL DEFAULT '[]',
    "photo_car" JSONB NOT NULL DEFAULT '[]',
    "params" JSONB NOT NULL DEFAULT '[]',
    "long" DECIMAL(65,30) DEFAULT 0,
    "lat" DECIMAL(65,30) DEFAULT 0,
    "machineColor" TEXT,
    "machineNumber" TEXT,
    "company_name" TEXT,
    "company_inn" TEXT,
    "pinfl" TEXT,
    "legal" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "merchant_id" INTEGER,
    "region_id" INTEGER,
    "structure_id" INTEGER,
    "is_online" BOOLEAN NOT NULL DEFAULT true,
    "in_work" BOOLEAN NOT NULL DEFAULT false,
    "fcm_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "phone" TEXT NOT NULL,
    "legal" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "img" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "long" DECIMAL(65,30) DEFAULT 0,
    "lat" DECIMAL(65,30) DEFAULT 0,
    "fcm_token" TEXT,
    "region_id" INTEGER,
    "structure_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machines" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "name_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT,
    "img" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineParams" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "name_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT,
    "key" TEXT,
    "prefix" TEXT,
    "machine_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "params" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineParamsFilters" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "filter_params" JSONB NOT NULL DEFAULT '[]',
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineParamsFilters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankCard" (
    "id" SERIAL NOT NULL,
    "card_id" INTEGER NOT NULL,
    "pan" TEXT NOT NULL,
    "expiry" TEXT NOT NULL,
    "card_holder" TEXT,
    "client_id" INTEGER,
    "driver_id" INTEGER,
    "balance" INTEGER,
    "phone" TEXT,
    "card_token" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT,
    "expire" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "inn" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "name_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Structure" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "name_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "driver_id" INTEGER,
    "machine_id" INTEGER,
    "amount" INTEGER NOT NULL,
    "payment_type" INTEGER NOT NULL DEFAULT 1,
    "status" INTEGER NOT NULL DEFAULT 1,
    "start_at" TEXT,
    "driver_arrived_time" TEXT,
    "start_hour" TEXT,
    "end_hour" TEXT,
    "total_work_hour" INTEGER,
    "total_work_minut" INTEGER,
    "total_pause_hour" INTEGER,
    "total_pause_minut" INTEGER,
    "paid_waiting_time" TEXT,
    "paid_waiting_amount" INTEGER,
    "hour_count" INTEGER,
    "km_count" INTEGER,
    "total_amount" INTEGER,
    "type" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "params" JSONB NOT NULL DEFAULT '[]',
    "long" TEXT,
    "lat" TEXT,
    "address" TEXT,
    "service_amount" INTEGER,
    "time_is_continue" BOOLEAN NOT NULL DEFAULT false,
    "structure_id" INTEGER,
    "region_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderPause" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "start_pause" TEXT NOT NULL,
    "end_pause" TEXT,
    "total_time" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderPause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachinePrice" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "min_amount" INTEGER,
    "minimum" INTEGER,
    "price_mode" TEXT NOT NULL DEFAULT 'hour',
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachinePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachinePriceParams" (
    "id" SERIAL NOT NULL,
    "parameter" INTEGER,
    "parameter_name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "machine_price_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachinePriceParams_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "driver_id" INTEGER,
    "client_id" INTEGER,
    "structure_id" INTEGER,
    "amount" INTEGER NOT NULL,
    "state" INTEGER,
    "currency" TEXT DEFAULT 'UZS',
    "name" TEXT,
    "pan" TEXT,
    "confirmed" BOOLEAN,
    "prepay_time" TEXT,
    "confirm_time" TEXT,
    "partner_id" INTEGER,
    "invoice" INTEGER,
    "card_token" TEXT,
    "card_id" INTEGER,
    "commission" TEXT,
    "deposit_amount" TEXT,
    "request" JSONB,
    "response" JSONB,
    "description" TEXT,
    "type" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCommission" (
    "id" SERIAL NOT NULL,
    "nds_amount" INTEGER NOT NULL,
    "nds_percentage" BOOLEAN NOT NULL DEFAULT false,
    "arendum_amount" INTEGER NOT NULL DEFAULT 0,
    "arendum_percentage" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER NOT NULL DEFAULT 1,
    "driver_balance" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCommission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_phone_key" ON "Driver"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE INDEX "Driver_id_idx" ON "Driver"("id");

-- CreateIndex
CREATE INDEX "Driver_status_idx" ON "Driver"("status");

-- CreateIndex
CREATE INDEX "Driver_is_online_idx" ON "Driver"("is_online");

-- CreateIndex
CREATE INDEX "Driver_in_work_idx" ON "Driver"("in_work");

-- CreateIndex
CREATE INDEX "Driver_machine_id_idx" ON "Driver"("machine_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_id_idx" ON "Client"("id");

-- CreateIndex
CREATE INDEX "Machines_id_idx" ON "Machines"("id");

-- CreateIndex
CREATE INDEX "MachineParams_id_idx" ON "MachineParams"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_user_id_key" ON "UserToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_phone_key" ON "Merchant"("phone");

-- CreateIndex
CREATE INDEX "Region_id_idx" ON "Region"("id");

-- CreateIndex
CREATE INDEX "Structure_id_idx" ON "Structure"("id");

-- CreateIndex
CREATE INDEX "Order_id_idx" ON "Order"("id");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_structure_id_idx" ON "Order"("structure_id");

-- CreateIndex
CREATE INDEX "Order_client_id_idx" ON "Order"("client_id");

-- CreateIndex
CREATE INDEX "Order_driver_id_idx" ON "Order"("driver_id");

-- CreateIndex
CREATE INDEX "OrderPause_id_idx" ON "OrderPause"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MachinePrice_machine_id_key" ON "MachinePrice"("machine_id");

-- CreateIndex
CREATE INDEX "MachinePrice_id_idx" ON "MachinePrice"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_client_id_key" ON "UserBalance"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_driver_id_key" ON "UserBalance"("driver_id");

-- CreateIndex
CREATE INDEX "Transaction_id_idx" ON "Transaction"("id");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_structure_id_idx" ON "Transaction"("structure_id");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_created_at_idx" ON "Transaction"("created_at");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineParams" ADD CONSTRAINT "MachineParams_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineParamsFilters" ADD CONSTRAINT "MachineParamsFilters_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankCard" ADD CONSTRAINT "BankCard_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankCard" ADD CONSTRAINT "BankCard_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPause" ADD CONSTRAINT "OrderPause_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachinePrice" ADD CONSTRAINT "MachinePrice_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachinePriceParams" ADD CONSTRAINT "MachinePriceParams_machine_price_id_fkey" FOREIGN KEY ("machine_price_id") REFERENCES "MachinePrice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
