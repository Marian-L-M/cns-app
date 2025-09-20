/*
  Warnings:

  - You are about to drop the column `mapScale` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `wx` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `wy` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Map` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Map" DROP COLUMN "mapScale",
DROP COLUMN "wx",
DROP COLUMN "wy",
DROP COLUMN "x",
DROP COLUMN "y";
