/*
  Warnings:

  - Made the column `wikiId` on table `WikiInfoboxItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WikiInfoboxItem" ALTER COLUMN "wikiId" SET NOT NULL;
