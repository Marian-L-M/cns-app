-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "provider" TEXT NOT NULL DEFAULT 'uploadthing',
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "title" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "tags" TEXT[],
    "uploadedById" TEXT NOT NULL,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storyId" INTEGER NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "story_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mapId" INTEGER NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "map_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_hierarchy_media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mapHierarchyId" INTEGER NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "map_hierarchy_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wiki_media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wikiId" INTEGER NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "wiki_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_object_media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "globalObjectId" INTEGER NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "global_object_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_area_media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "globalAreaId" INTEGER NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "global_area_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profile_media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userProfileId" INTEGER NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "user_profile_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings_media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "AdminSettingsId" INTEGER NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "settings_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaItem_fileKey_key" ON "MediaItem"("fileKey");

-- CreateIndex
CREATE INDEX "MediaItem_uploadedById_idx" ON "MediaItem"("uploadedById");

-- CreateIndex
CREATE INDEX "MediaItem_provider_idx" ON "MediaItem"("provider");

-- CreateIndex
CREATE INDEX "MediaItem_mimeType_idx" ON "MediaItem"("mimeType");

-- CreateIndex
CREATE INDEX "MediaItem_createdAt_idx" ON "MediaItem"("createdAt");

-- CreateIndex
CREATE INDEX "story_media_storyId_idx" ON "story_media"("storyId");

-- CreateIndex
CREATE INDEX "story_media_mediaItemId_idx" ON "story_media"("mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "story_media_storyId_mediaItemId_key" ON "story_media"("storyId", "mediaItemId");

-- CreateIndex
CREATE INDEX "map_media_mapId_idx" ON "map_media"("mapId");

-- CreateIndex
CREATE INDEX "map_media_mediaItemId_idx" ON "map_media"("mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "map_media_mapId_mediaItemId_key" ON "map_media"("mapId", "mediaItemId");

-- CreateIndex
CREATE INDEX "map_hierarchy_media_mapHierarchyId_idx" ON "map_hierarchy_media"("mapHierarchyId");

-- CreateIndex
CREATE INDEX "map_hierarchy_media_mediaItemId_idx" ON "map_hierarchy_media"("mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "map_hierarchy_media_mapHierarchyId_mediaItemId_key" ON "map_hierarchy_media"("mapHierarchyId", "mediaItemId");

-- CreateIndex
CREATE INDEX "wiki_media_wikiId_idx" ON "wiki_media"("wikiId");

-- CreateIndex
CREATE INDEX "wiki_media_mediaItemId_idx" ON "wiki_media"("mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "wiki_media_wikiId_mediaItemId_key" ON "wiki_media"("wikiId", "mediaItemId");

-- CreateIndex
CREATE INDEX "global_object_media_globalObjectId_idx" ON "global_object_media"("globalObjectId");

-- CreateIndex
CREATE INDEX "global_object_media_mediaItemId_idx" ON "global_object_media"("mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "global_object_media_globalObjectId_mediaItemId_key" ON "global_object_media"("globalObjectId", "mediaItemId");

-- CreateIndex
CREATE INDEX "global_area_media_globalAreaId_idx" ON "global_area_media"("globalAreaId");

-- CreateIndex
CREATE INDEX "global_area_media_mediaItemId_idx" ON "global_area_media"("mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "global_area_media_globalAreaId_mediaItemId_key" ON "global_area_media"("globalAreaId", "mediaItemId");

-- CreateIndex
CREATE INDEX "user_profile_media_userProfileId_idx" ON "user_profile_media"("userProfileId");

-- CreateIndex
CREATE INDEX "user_profile_media_mediaItemId_idx" ON "user_profile_media"("mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_media_userProfileId_mediaItemId_key" ON "user_profile_media"("userProfileId", "mediaItemId");

-- CreateIndex
CREATE INDEX "settings_media_AdminSettingsId_idx" ON "settings_media"("AdminSettingsId");

-- CreateIndex
CREATE INDEX "settings_media_mediaItemId_idx" ON "settings_media"("mediaItemId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_media_AdminSettingsId_mediaItemId_key" ON "settings_media"("AdminSettingsId", "mediaItemId");
