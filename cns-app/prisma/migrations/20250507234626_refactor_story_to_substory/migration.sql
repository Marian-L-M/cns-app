/*
  Warnings:

  - You are about to drop the `Story` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Story";

-- CreateTable
CREATE TABLE "SubStory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "nodes" JSONB[],
    "objectTime" INTEGER NOT NULL,
    "entryId" INTEGER NOT NULL,

    CONSTRAINT "SubStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubStory_entryId_idx" ON "SubStory"("entryId");
