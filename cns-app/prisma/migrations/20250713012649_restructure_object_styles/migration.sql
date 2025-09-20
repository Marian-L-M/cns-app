/*
  Warnings:

  - The `type` column on the `CanvasStyleItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `imageUrl` on the `GlobalObject` table. All the data in the column will be lost.
  - You are about to drop the column `styles` on the `GlobalObject` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CanvasIconType" AS ENUM ('label', 'font', 'imageSize', 'imageOpacity', 'fontFillStyle', 'svgFillStyle', 'svgStrokeStyle');

-- AlterTable
ALTER TABLE "CanvasStyleItem" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "GlobalObject" DROP COLUMN "imageUrl",
DROP COLUMN "styles";
