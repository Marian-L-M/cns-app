-- CreateEnum
CREATE TYPE "CanvasStyleItemType" AS ENUM ('font', 'lineWidth', 'fillStyle', 'strokeStyle');

-- CreateTable
CREATE TABLE "CanvasStyleItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "CanvasStyleItemType" NOT NULL,
    "mapId" INTEGER NOT NULL,
    "globalObjectId" INTEGER,
    "globalAreaId" INTEGER,
    "mapHierarchyChildId" INTEGER,
    "subStoryId" INTEGER,

    CONSTRAINT "CanvasStyleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CanvasStyleItem_mapId_idx" ON "CanvasStyleItem"("mapId");

-- CreateIndex
CREATE INDEX "CanvasStyleItem_globalObjectId_idx" ON "CanvasStyleItem"("globalObjectId");

-- CreateIndex
CREATE INDEX "CanvasStyleItem_globalAreaId_idx" ON "CanvasStyleItem"("globalAreaId");

-- CreateIndex
CREATE INDEX "CanvasStyleItem_mapHierarchyChildId_idx" ON "CanvasStyleItem"("mapHierarchyChildId");

-- CreateIndex
CREATE INDEX "CanvasStyleItem_subStoryId_idx" ON "CanvasStyleItem"("subStoryId");

-- CreateIndex
CREATE INDEX "User_storyId_idx" ON "User"("storyId");

-- CreateIndex
CREATE INDEX "User_mapId_idx" ON "User"("mapId");

-- CreateIndex
CREATE INDEX "User_mapHierarchyId_idx" ON "User"("mapHierarchyId");

-- CreateIndex
CREATE INDEX "User_subStoryId_idx" ON "User"("subStoryId");

-- CreateIndex
CREATE INDEX "User_wikiId_idx" ON "User"("wikiId");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");
