-- CreateTable
CREATE TABLE "AdminSettings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
);
