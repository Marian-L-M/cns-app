/*
  Warnings:

  - You are about to drop the column `entryId` on the `SubStory` table. All the data in the column will be lost.
  - You are about to drop the column `entryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Entry` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `storyId` to the `SubStory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SubStory_entryId_idx";

-- AlterTable
ALTER TABLE "SubStory" DROP COLUMN "entryId",
ADD COLUMN     "storyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "entryId",
ADD COLUMN     "subStoryId" INTEGER;

-- DropTable
DROP TABLE "Entry";

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storyTime" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'UPCOMING',
    "assignedToMapID" INTEGER,
    "rating" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entry_slug_idx" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_assignedToMapID_idx" ON "Story"("assignedToMapID");

-- CreateIndex
CREATE INDEX "SubStory_storyId_idx" ON "SubStory"("storyId");
