-- AlterTable
ALTER TABLE "GlobalArea" ADD COLUMN     "bannerUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "GlobalObject" ADD COLUMN     "bannerUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "bannerUrl" TEXT NOT NULL DEFAULT '';
