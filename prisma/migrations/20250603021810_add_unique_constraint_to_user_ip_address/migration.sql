/*
  Warnings:

  - A unique constraint covering the columns `[ipAddress,userId]` on the table `UserIpAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserIpAddress_ipAddress_userId_key" ON "UserIpAddress"("ipAddress", "userId");
