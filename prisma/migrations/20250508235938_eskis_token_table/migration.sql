-- CreateTable
CREATE TABLE "SmsHistory" (
    "id" SERIAL NOT NULL,
    "partner_id" TEXT,
    "merchant_id" INTEGER,
    "dispatch_id" INTEGER,
    "user_sms_id" INTEGER,
    "request_id" TEXT,
    "price" INTEGER,
    "total_price" INTEGER,
    "from_company" TEXT,
    "to_phone" TEXT,
    "message" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "sent_at" TEXT,
    "submit_sm_resp_at" TEXT,
    "delivery_sm_at" TEXT,

    CONSTRAINT "SmsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EskizToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expire" BIGINT NOT NULL,

    CONSTRAINT "EskizToken_pkey" PRIMARY KEY ("id")
);
