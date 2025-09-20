/*
  Warnings:

  - You are about to drop the `MasterMap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChildMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MasterMap";

-- DropTable
DROP TABLE "_ChildMap";

-- CreateTable
CREATE TABLE "MapHierarchyMaster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "parentMapId" INTEGER NOT NULL,

    CONSTRAINT "MapHierarchyMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapHierarchyChild" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hierarchyId" INTEGER NOT NULL,
    "childMapId" INTEGER NOT NULL,

    CONSTRAINT "MapHierarchyChild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MapHierarchyMaster_parentMapId_idx" ON "MapHierarchyMaster"("parentMapId");

-- CreateIndex
CREATE INDEX "MapHierarchyChild_hierarchyId_idx" ON "MapHierarchyChild"("hierarchyId");

-- CreateIndex
CREATE INDEX "MapHierarchyChild_childMapId_idx" ON "MapHierarchyChild"("childMapId");

-- CreateIndex
CREATE UNIQUE INDEX "MapHierarchyChild_hierarchyId_childMapId_key" ON "MapHierarchyChild"("hierarchyId", "childMapId");
