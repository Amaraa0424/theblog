/*
  Warnings:

  - Added the required column `type` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VerificationToken_userId_key";

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'SIGNUP';
ALTER TABLE "VerificationToken" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Remove the defaults after the columns are added
ALTER TABLE "VerificationToken" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "VerificationToken" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");
