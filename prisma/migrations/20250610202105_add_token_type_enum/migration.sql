/*
  Warnings:

  - Changed the type of `type` on the `VerificationToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('SIGNUP', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "type",
ADD COLUMN     "type" "TokenType" NOT NULL;
