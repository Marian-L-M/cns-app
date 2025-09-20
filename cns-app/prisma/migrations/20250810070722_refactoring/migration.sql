/*
  Warnings:

  - You are about to drop the column `UserId` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserProfile_UserId_idx";

-- DropIndex
DROP INDEX "UserProfile_UserId_key";

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "UserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "UserProfile"("userId");
