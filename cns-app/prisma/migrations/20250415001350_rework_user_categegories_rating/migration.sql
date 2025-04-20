/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Map` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Wiki` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "category" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "Wiki" ADD COLUMN     "category" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "profileCatch" TEXT NOT NULL,
    "profileDescription" TEXT NOT NULL,
    "thumbnail" TEXT,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_slug_idx" ON "UserProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_displayName_key" ON "UserProfile"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_UserId_key" ON "UserProfile"("UserId");

-- CreateIndex
CREATE INDEX "UserProfile_UserId_idx" ON "UserProfile"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "entry_slug_idx" ON "Entry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "map_slug_idx" ON "Map"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "wiki_slug_idx" ON "Wiki"("slug");
