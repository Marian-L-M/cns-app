-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'ONGOING', 'UPCOMING');

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'UPCOMING';
