/*
  Warnings:

  - You are about to drop the column `storyId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContentRole" AS ENUM ('OWNER', 'EDITOR');

-- DropIndex
DROP INDEX "User_storyId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "storyId";

-- CreateTable
CREATE TABLE "user_stories" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "storyId" INTEGER NOT NULL,
    "role" "ContentRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_stories_userId_idx" ON "user_stories"("userId");

-- CreateIndex
CREATE INDEX "user_stories_storyId_idx" ON "user_stories"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_stories_userId_storyId_key" ON "user_stories"("userId", "storyId");
