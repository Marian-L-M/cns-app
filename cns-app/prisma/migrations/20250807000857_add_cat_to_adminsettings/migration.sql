-- CreateEnum
CREATE TYPE "AdminSettingsType" AS ENUM ('USER', 'PAGE', 'DESIGN', 'OTHER');

-- AlterTable
ALTER TABLE "AdminSettings" ADD COLUMN     "category" "AdminSettingsType" NOT NULL DEFAULT 'OTHER';
