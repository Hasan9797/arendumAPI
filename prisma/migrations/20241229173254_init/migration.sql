-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "merchant_id" INTEGER,
    "photo_tex_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_license" JSONB NOT NULL DEFAULT '[]',
    "photo_confidence_passport" JSONB NOT NULL DEFAULT '[]',
    "photo_driver_license" JSONB NOT NULL DEFAULT '[]',
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "legal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machines" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineParams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "params" JSONB NOT NULL DEFAULT '[]',
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MachineParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineParamsFilters" (
    "id" SERIAL NOT NULL,
    "machine_id" INTEGER NOT NULL,
    "filter_params" JSONB NOT NULL DEFAULT '[]',
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MachineParamsFilters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankCard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "expire" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BankCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expire" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "legal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_phone_key" ON "Driver"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_phone_key" ON "Merchant"("phone");

-- AddForeignKey
ALTER TABLE "MachineParams" ADD CONSTRAINT "MachineParams_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineParamsFilters" ADD CONSTRAINT "MachineParamsFilters_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
