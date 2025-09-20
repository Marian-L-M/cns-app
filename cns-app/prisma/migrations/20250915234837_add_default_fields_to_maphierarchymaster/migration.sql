-- AlterTable
ALTER TABLE "MapHierarchyMaster" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
