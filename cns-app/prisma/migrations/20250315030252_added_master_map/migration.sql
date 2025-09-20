-- CreateTable
CREATE TABLE "MasterMap" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "parentMapID" INTEGER NOT NULL,

    CONSTRAINT "MasterMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChildMap" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "MasterMap_parentMapID_idx" ON "MasterMap"("parentMapID");

-- CreateIndex
CREATE UNIQUE INDEX "_ChildMap_AB_unique" ON "_ChildMap"("A", "B");

-- CreateIndex
CREATE INDEX "_ChildMap_B_index" ON "_ChildMap"("B");
