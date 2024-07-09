/*
  Warnings:

  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- CreateEnum
CREATE TYPE "MapObjectType" AS ENUM ('LOCATION', 'HISTORY', 'NATURAL');

-- CreateEnum
CREATE TYPE "MapAreaType" AS ENUM ('GEOGRAPHY', 'ABSTRACT', 'INTERACTIVE');

-- DropForeignKey
ALTER TABLE "_EntryToUser" DROP CONSTRAINT "_EntryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EntryToUser" DROP CONSTRAINT "_EntryToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "Map" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "wx" INTEGER NOT NULL,
    "wy" INTEGER NOT NULL,
    "mapScale" INTEGER NOT NULL,
    "mapTime" INTEGER NOT NULL,
    "mapUrl" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalObject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "thumbUrl" TEXT NOT NULL,
    "infobox" JSONB,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "objectTime" INTEGER NOT NULL,
    "mapId" TEXT NOT NULL,
    "type" "MapObjectType" NOT NULL DEFAULT 'LOCATION',

    CONSTRAINT "GlobalObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalArea" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "infobox" JSONB,
    "nodes" JSONB,
    "styles" JSONB,
    "objectTime" INTEGER NOT NULL,
    "mapId" TEXT NOT NULL,
    "type" "MapAreaType" NOT NULL DEFAULT 'GEOGRAPHY',

    CONSTRAINT "GlobalArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Map_entryId_key" ON "Map"("entryId");

-- CreateIndex
CREATE INDEX "Map_entryId_idx" ON "Map"("entryId");

-- CreateIndex
CREATE INDEX "GlobalObject_mapId_idx" ON "GlobalObject"("mapId");

-- CreateIndex
CREATE INDEX "GlobalArea_mapId_idx" ON "GlobalArea"("mapId");
