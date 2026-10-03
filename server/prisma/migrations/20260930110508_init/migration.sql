-- CreateEnum
CREATE TYPE "OpenClassification" AS ENUM ('HUMAN_LIKE', 'PROXY_OR_SCANNER', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipient" (
    "id" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "trackingToken" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailId" TEXT NOT NULL,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipHash" TEXT,
    "classification" "OpenClassification" NOT NULL DEFAULT 'UNKNOWN',
    "recipientId" TEXT NOT NULL,

    CONSTRAINT "OpenEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_trackingToken_key" ON "Recipient"("trackingToken");

-- CreateIndex
CREATE INDEX "Recipient_emailId_idx" ON "Recipient"("emailId");

-- CreateIndex
CREATE INDEX "Recipient_emailAddress_idx" ON "Recipient"("emailAddress");

-- CreateIndex
CREATE INDEX "OpenEvent_recipientId_idx" ON "OpenEvent"("recipientId");

-- CreateIndex
CREATE INDEX "OpenEvent_timestamp_idx" ON "OpenEvent"("timestamp");

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenEvent" ADD CONSTRAINT "OpenEvent_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
