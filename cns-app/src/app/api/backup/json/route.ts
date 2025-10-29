// app/api/admin/backup/full/route.ts
import { auth } from "@/auth";
import prisma from "@/../prisma/db";

import { VERSION_NUMBER } from "@/lib/constants";

export async function GET(req: Request) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // Fetch All data tables
    // Remember to update upon changes to prisma schema
    const [
      users,
      userProfiles,
      accounts,
      sessions,
      stories,
      subStories,
      maps,
      mapHierarchies,
      mapHierarchyChildren,
      wikis,
      wikiInfoboxItems,
      globalObjects,
      globalAreas,
      canvasStyleItems,
      mediaItems,
      adminSettings,
      userStories,
      userMaps,
      userMapHierarchies,
      userWikis,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.userProfile.findMany(),
      prisma.account.findMany(),
      prisma.session.findMany(),
      prisma.story.findMany(),
      prisma.subStory.findMany(),
      prisma.map.findMany(),
      prisma.mapHierarchyMaster.findMany(),
      prisma.mapHierarchyChild.findMany(),
      prisma.wiki.findMany(),
      prisma.wikiInfoboxItem.findMany(),
      prisma.globalObject.findMany(),
      prisma.globalArea.findMany(),
      prisma.canvasStyleItem.findMany(),
      prisma.mediaItem.findMany(),
      prisma.adminSettings.findMany(),
      prisma.userStory.findMany(),
      prisma.userMap.findMany(),
      prisma.userMapHierarchy.findMany(),
      prisma.userWiki.findMany(),
    ]);

    const backup = {
      metadata: {
        version: VERSION_NUMBER,
        timestamp: new Date().toISOString(),
        exportedBy: session.user.id,
        database: "postgresql",
        prismaVersion: "5.x", // Should extract from package.json
        recordCounts: {
          users: users.length,
          stories: stories.length,
          maps: maps.length,
          wikis: wikis.length,
          mediaItems: mediaItems.length,
          totalRecords:
            users.length +
            stories.length +
            maps.length +
            wikis.length +
            mediaItems.length +
            userProfiles.length +
            accounts.length +
            sessions.length +
            subStories.length +
            mapHierarchies.length +
            mapHierarchyChildren.length +
            wikiInfoboxItems.length +
            globalObjects.length +
            globalAreas.length +
            canvasStyleItems.length +
            userStories.length +
            userMaps.length +
            userMapHierarchies.length +
            userWikis.length +
            adminSettings.length,
        },
      },

      // Core tables
      users: users.map(serializeRecord),
      userProfiles: userProfiles.map(serializeRecord),
      accounts: accounts.map(serializeRecord),
      sessions: sessions.map(serializeRecord),

      // Content tables
      stories: stories.map(serializeRecord),
      subStories: subStories.map(serializeRecord),
      maps: maps.map(serializeRecord),
      mapHierarchies: mapHierarchies.map(serializeRecord),
      mapHierarchyChildren: mapHierarchyChildren.map(serializeRecord),
      wikis: wikis.map(serializeRecord),
      wikiInfoboxItems: wikiInfoboxItems.map(serializeRecord),
      globalObjects: globalObjects.map(serializeRecord),
      globalAreas: globalAreas.map(serializeRecord),
      canvasStyleItems: canvasStyleItems.map(serializeRecord),
      mediaItems: mediaItems.map(serializeRecord),
      adminSettings: adminSettings.map(serializeRecord),

      // Junction tables
      userStories: userStories.map(serializeRecord),
      userMaps: userMaps.map(serializeRecord),
      userMapHierarchies: userMapHierarchies.map(serializeRecord),
      userWikis: userWikis.map(serializeRecord),
    };

    const filename = `full-backup-${
      new Date().toISOString().split("T")[0]
    }-${Date.now()}.json`;

    return new Response(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Backup failed:", error);
    return Response.json(
      {
        error: "Backup failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper to serialize records (handles dates, BigInt, etc.)
function serializeRecord(record: any) {
  return JSON.parse(
    JSON.stringify(record, (key, value) => {
      // Handle Date objects
      if (value instanceof Date) {
        return value.toISOString();
      }
      // Handle BigInt if you have any
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    })
  );
}
