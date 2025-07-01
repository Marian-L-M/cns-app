/*
  Warnings:

  - You are about to drop the column `infobox` on the `GlobalArea` table. All the data in the column will be lost.
  - You are about to drop the column `infobox` on the `GlobalObject` table. All the data in the column will be lost.
  - You are about to drop the column `infobox` on the `Wiki` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WikiInfoboxType" AS ENUM ('IMAGE', 'COLLECTION', 'TEXT');

-- AlterTable
ALTER TABLE "GlobalArea" DROP COLUMN "infobox";

-- AlterTable
ALTER TABLE "GlobalObject" DROP COLUMN "infobox";

-- AlterTable
ALTER TABLE "Wiki" DROP COLUMN "infobox";

-- CreateTable
CREATE TABLE "WikiInfoboxItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "WikiInfoboxType" NOT NULL DEFAULT 'TEXT',
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "collections" JSON[],
    "wikiId" INTEGER,

    CONSTRAINT "WikiInfoboxItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WikiInfoboxItem_wikiId_idx" ON "WikiInfoboxItem"("wikiId");
