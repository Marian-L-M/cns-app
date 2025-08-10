/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "socials" JSONB[];
