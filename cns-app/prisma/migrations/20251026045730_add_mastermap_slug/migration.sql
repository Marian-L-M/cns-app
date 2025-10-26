/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `MapHierarchyMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MapHierarchyMaster" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "mastermap_slug_idx" ON "MapHierarchyMaster"("slug");
