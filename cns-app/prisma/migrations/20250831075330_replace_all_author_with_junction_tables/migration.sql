/*
  Warnings:

  - You are about to drop the column `mapHierarchyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mapId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subStoryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wikiId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_mapHierarchyId_idx";

-- DropIndex
DROP INDEX "User_mapId_idx";

-- DropIndex
DROP INDEX "User_subStoryId_idx";

-- DropIndex
DROP INDEX "User_wikiId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mapHierarchyId",
DROP COLUMN "mapId",
DROP COLUMN "subStoryId",
DROP COLUMN "wikiId";

-- CreateTable
CREATE TABLE "user_maps" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "mapId" INTEGER NOT NULL,
    "role" "ContentRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_map_hierarchies" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "mapHierarchyId" INTEGER NOT NULL,
    "role" "ContentRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_map_hierarchies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sub_stories" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "subStoryId" INTEGER NOT NULL,
    "role" "ContentRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sub_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_wikis" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "wikiId" INTEGER NOT NULL,
    "role" "ContentRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_wikis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_maps_userId_idx" ON "user_maps"("userId");

-- CreateIndex
CREATE INDEX "user_maps_mapId_idx" ON "user_maps"("mapId");

-- CreateIndex
CREATE UNIQUE INDEX "user_maps_userId_mapId_key" ON "user_maps"("userId", "mapId");

-- CreateIndex
CREATE INDEX "user_map_hierarchies_userId_idx" ON "user_map_hierarchies"("userId");

-- CreateIndex
CREATE INDEX "user_map_hierarchies_mapHierarchyId_idx" ON "user_map_hierarchies"("mapHierarchyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_map_hierarchies_userId_mapHierarchyId_key" ON "user_map_hierarchies"("userId", "mapHierarchyId");

-- CreateIndex
CREATE INDEX "user_sub_stories_userId_idx" ON "user_sub_stories"("userId");

-- CreateIndex
CREATE INDEX "user_sub_stories_subStoryId_idx" ON "user_sub_stories"("subStoryId");

-- CreateIndex
CREATE UNIQUE INDEX "user_sub_stories_userId_subStoryId_key" ON "user_sub_stories"("userId", "subStoryId");

-- CreateIndex
CREATE INDEX "user_wikis_userId_idx" ON "user_wikis"("userId");

-- CreateIndex
CREATE INDEX "user_wikis_wikiId_idx" ON "user_wikis"("wikiId");

-- CreateIndex
CREATE UNIQUE INDEX "user_wikis_userId_wikiId_key" ON "user_wikis"("userId", "wikiId");
