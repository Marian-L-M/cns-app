-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'INACTIVE';

-- AlterTable
ALTER TABLE "AdminSettings" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;
