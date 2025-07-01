/*
  Warnings:

  - Added the required column `order` to the `WikiInfoboxItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WikiInfoboxItem" ADD COLUMN     "order" INTEGER NOT NULL;
