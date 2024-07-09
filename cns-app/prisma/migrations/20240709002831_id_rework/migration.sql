/*
  Warnings:

  - The primary key for the `Entry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Entry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `GlobalArea` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `GlobalArea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `GlobalObject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `GlobalObject` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Map` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Map` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `mapId` on the `GlobalArea` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mapId` on the `GlobalObject` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `entryId` on the `Map` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_EntryToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Entry_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GlobalArea" DROP CONSTRAINT "GlobalArea_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "mapId",
ADD COLUMN     "mapId" INTEGER NOT NULL,
ADD CONSTRAINT "GlobalArea_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GlobalObject" DROP CONSTRAINT "GlobalObject_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "mapId",
ADD COLUMN     "mapId" INTEGER NOT NULL,
ADD CONSTRAINT "GlobalObject_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Map" DROP CONSTRAINT "Map_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "entryId",
ADD COLUMN     "entryId" INTEGER NOT NULL,
ADD CONSTRAINT "Map_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_EntryToUser" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "GlobalArea_mapId_idx" ON "GlobalArea"("mapId");

-- CreateIndex
CREATE INDEX "GlobalObject_mapId_idx" ON "GlobalObject"("mapId");

-- CreateIndex
CREATE UNIQUE INDEX "Map_entryId_key" ON "Map"("entryId");

-- CreateIndex
CREATE INDEX "Map_entryId_idx" ON "Map"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "_EntryToUser_AB_unique" ON "_EntryToUser"("A", "B");
