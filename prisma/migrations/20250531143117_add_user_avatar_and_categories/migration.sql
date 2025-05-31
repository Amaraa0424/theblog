/*
  Warnings:

  - Added the required column `categoryId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- Create default category
INSERT INTO "Category" ("id", "name", "description", "updatedAt")
VALUES ('00000000-0000-0000-0000-000000000000', 'Uncategorized', 'Default category for existing posts', CURRENT_TIMESTAMP);

-- AlterTable: Add categoryId column as nullable first
ALTER TABLE "Post" ADD COLUMN "categoryId" TEXT;

-- Update existing posts to use default category
UPDATE "Post" SET "categoryId" = '00000000-0000-0000-0000-000000000000'
WHERE "categoryId" IS NULL;

-- Now make categoryId required
ALTER TABLE "Post" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
