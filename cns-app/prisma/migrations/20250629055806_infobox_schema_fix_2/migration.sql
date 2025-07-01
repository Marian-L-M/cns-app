/*
  Warnings:

  - You are about to alter the column `title` on the `WikiInfoboxItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `imageUrl` on the `WikiInfoboxItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `caption` on the `WikiInfoboxItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Made the column `title` on table `WikiInfoboxItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `WikiInfoboxItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `WikiInfoboxItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `caption` on table `WikiInfoboxItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WikiInfoboxItem" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "imageUrl" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "caption" SET NOT NULL,
ALTER COLUMN "caption" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "collections" SET DEFAULT ARRAY[]::JSON[];
