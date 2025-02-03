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
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "phone" TEXT NOT NULL,
    "machine_id" INTEGER,
    "email" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "photo_tex_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_license" JSONB NOT NULL DEFAULT '[]',
    "photo_confidence_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_driver_license" JSONB NOT NULL DEFAULT '[]',
    "photo_car" JSONB NOT NULL DEFAULT '[]',
    "params" JSONB NOT NULL DEFAULT '{}',
    "long" DECIMAL(65,30) DEFAULT 0,
    "lat" DECIMAL(65,30) DEFAULT 0,
    "machineColor" TEXT,
    "machineNumber" TEXT,
    "company_name" TEXT,
    "legal" BOOLEAN NOT NULL DEFAULT false,
    "merchant_id" INTEGER,
    "region_id" INTEGER,
    "structure_id" INTEGER,
    "fcm_token" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "phone" TEXT NOT NULL,
    "legal" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "long" DECIMAL(65,30) DEFAULT 0,
    "lat" DECIMAL(65,30) DEFAULT 0,
    "fcm_token" TEXT,
    "region_id" INTEGER,
    "structure_id" INTEGER,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

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
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineParams" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "name_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT,
    "prefix" TEXT,
    "machine_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "params" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "MachineParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineParamsFilters" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "filter_params" JSONB NOT NULL DEFAULT '[]',
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "MachineParamsFilters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankCard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "expire" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "BankCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expire" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "inn" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

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
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

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
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "driver_id" INTEGER,
    "machine_id" INTEGER,
    "amount" INTEGER NOT NULL,
    "amount_type" INTEGER NOT NULL DEFAULT 1,
    "status" INTEGER NOT NULL DEFAULT 1,
    "caunt" INTEGER NOT NULL DEFAULT 1,
    "order_params" JSONB NOT NULL DEFAULT '[]',
    "long" TEXT,
    "lat" TEXT,
    "structure_id" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachinePrice" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "min_amount" TEXT NOT NULL,
    "min_hour_time" TEXT NOT NULL,
    "tariff_name" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "MachinePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachinePriceParams" (
    "id" SERIAL NOT NULL,
    "parameter" TEXT NOT NULL,
    "parameter_name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "machine_price_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "MachinePriceParams_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_phone_key" ON "Merchant"("phone");

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
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachinePrice" ADD CONSTRAINT "MachinePrice_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachinePriceParams" ADD CONSTRAINT "MachinePriceParams_machine_price_id_fkey" FOREIGN KEY ("machine_price_id") REFERENCES "MachinePrice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
