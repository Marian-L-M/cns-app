/*
  Warnings:

  - You are about to drop the column `entryId` on the `Map` table. All the data in the column will be lost.
  - Added the required column `wikiId` to the `GlobalArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wikiId` to the `GlobalObject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MapObjectType" ADD VALUE 'EVENT';

-- DropIndex
DROP INDEX "Map_entryId_idx";

-- DropIndex
DROP INDEX "Map_entryId_key";

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "assignedToMapID" INTEGER;

-- AlterTable
ALTER TABLE "GlobalArea" ADD COLUMN     "wikiId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GlobalObject" ADD COLUMN     "wikiId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Map" DROP COLUMN "entryId";

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "nodes" JSONB,
    "objectTime" INTEGER NOT NULL,
    "entryId" INTEGER NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wiki" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "infobox" JSONB,

    CONSTRAINT "Wiki_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Story_entryId_idx" ON "Story"("entryId");

-- CreateIndex
CREATE INDEX "Entry_assignedToMapID_idx" ON "Entry"("assignedToMapID");

-- CreateIndex
CREATE INDEX "GlobalArea_wikiId_idx" ON "GlobalArea"("wikiId");

-- CreateIndex
CREATE INDEX "GlobalObject_wikiId_idx" ON "GlobalObject"("wikiId");
