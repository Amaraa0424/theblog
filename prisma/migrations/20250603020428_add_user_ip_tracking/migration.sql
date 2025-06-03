-- CreateTable
CREATE TABLE "UserIpAddress" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "userId" TEXT,
    "isGuest" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserIpAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserIpAddress_ipAddress_idx" ON "UserIpAddress"("ipAddress");

-- CreateIndex
CREATE INDEX "UserIpAddress_userId_idx" ON "UserIpAddress"("userId");

-- AddForeignKey
ALTER TABLE "UserIpAddress" ADD CONSTRAINT "UserIpAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
