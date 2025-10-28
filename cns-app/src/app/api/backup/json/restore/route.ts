import { auth } from "@/auth";
import prisma from "@/../prisma/db";

import { VERSION_NUMBER } from "@/lib/constants";

export async function POST(req: Request) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const backup = await req.json();

  // Validate backup structure
  if (!backup.metadata || !backup.metadata.version) {
    return Response.json(
      {
        error: "Invalid backup file",
      },
      { status: 400 }
    );
  }

  // Check version compatibility
  const backupVersion = parseVersion(backup.metadata.version);
  const currentVersion = parseVersion(VERSION_NUMBER);

  if (backupVersion.major > currentVersion.major) {
    return Response.json(
      {
        error: `Backup version ${backup.metadata.version} is newer than supported version ${VERSION_NUMBER}. Please update your application.`,
      },
      { status: 400 }
    );
  }

  // Migrate if needed
  let migratedBackup = backup;
  if (
    backupVersion.major < currentVersion.major ||
    backupVersion.minor < currentVersion.minor
  ) {
    console.log(
      `Migrating backup from ${backup.metadata.version} to ${VERSION_NUMBER}`
    );
    migratedBackup = await migrateBackup(backup, backupVersion, currentVersion);
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        // CRITICAL: Import in correct order due to foreign key constraints

        console.log("Clearing existing data...");
        // Clear in reverse order of dependencies
        await tx.canvasStyleItem.deleteMany({});
        await tx.wikiInfoboxItem.deleteMany({});
        await tx.globalArea.deleteMany({});
        await tx.globalObject.deleteMany({});
        await tx.subStory.deleteMany({});
        await tx.mapHierarchyChild.deleteMany({});
        await tx.mapHierarchyMaster.deleteMany({});
        await tx.userStory.deleteMany({});
        await tx.userMap.deleteMany({});
        await tx.userMapHierarchy.deleteMany({});
        await tx.userWiki.deleteMany({});
        await tx.story.deleteMany({});
        await tx.map.deleteMany({});
        await tx.wiki.deleteMany({});
        await tx.mediaItem.deleteMany({});
        await tx.session.deleteMany({});
        await tx.account.deleteMany({});
        await tx.userProfile.deleteMany({});
        await tx.user.deleteMany({});
        await tx.adminSettings.deleteMany({});

        console.log("Restoring data...");

        // 1. Users (no dependencies)
        console.log(`Restoring ${migratedBackup.users.length} users...`);
        for (const user of migratedBackup.users) {
          await tx.user.create({
            data: deserializeRecord(user),
          });
        }

        // 2. User profiles (depends on users)
        console.log(
          `Restoring ${migratedBackup.userProfiles.length} user profiles...`
        );
        for (const profile of migratedBackup.userProfiles) {
          await tx.userProfile.create({
            data: deserializeRecord(profile),
          });
        }

        // 3. Accounts (depends on users)
        console.log(`Restoring ${migratedBackup.accounts.length} accounts...`);
        for (const account of migratedBackup.accounts) {
          await tx.account.create({
            data: deserializeRecord(account),
          });
        }

        // 4. Sessions (depends on users)
        console.log(`Restoring ${migratedBackup.sessions.length} sessions...`);
        for (const sessionData of migratedBackup.sessions) {
          await tx.session.create({
            data: deserializeRecord(sessionData),
          });
        }

        // 5. Admin Settings (no dependencies)
        console.log(
          `Restoring ${migratedBackup.adminSettings.length} admin settings...`
        );
        for (const setting of migratedBackup.adminSettings) {
          await tx.adminSettings.create({
            data: deserializeRecord(setting),
          });
        }

        // 6. Maps (no dependencies)
        console.log(`Restoring ${migratedBackup.maps.length} maps...`);
        for (const map of migratedBackup.maps) {
          await tx.map.create({
            data: deserializeRecord(map),
          });
        }

        // 7. Stories (depends on maps)
        console.log(`Restoring ${migratedBackup.stories.length} stories...`);
        for (const story of migratedBackup.stories) {
          await tx.story.create({
            data: deserializeRecord(story),
          });
        }

        // 8. SubStories (depends on stories)
        console.log(
          `Restoring ${migratedBackup.subStories.length} sub stories...`
        );
        for (const subStory of migratedBackup.subStories) {
          await tx.subStory.create({
            data: deserializeRecord(subStory),
          });
        }

        // 9. Map Hierarchies (depends on maps)
        console.log(
          `Restoring ${migratedBackup.mapHierarchies.length} map hierarchies...`
        );
        for (const hierarchy of migratedBackup.mapHierarchies) {
          await tx.mapHierarchyMaster.create({
            data: deserializeRecord(hierarchy),
          });
        }

        // 10. Map Hierarchy Children (depends on hierarchies and maps)
        console.log(
          `Restoring ${migratedBackup.mapHierarchyChildren.length} map hierarchy children...`
        );
        for (const child of migratedBackup.mapHierarchyChildren) {
          await tx.mapHierarchyChild.create({
            data: deserializeRecord(child),
          });
        }

        // 11. Wikis (no dependencies)
        console.log(`Restoring ${migratedBackup.wikis.length} wikis...`);
        for (const wiki of migratedBackup.wikis) {
          await tx.wiki.create({
            data: deserializeRecord(wiki),
          });
        }

        // 12. Wiki Infobox Items (depends on wikis)
        console.log(
          `Restoring ${migratedBackup.wikiInfoboxItems.length} wiki infobox items...`
        );
        for (const item of migratedBackup.wikiInfoboxItems) {
          await tx.wikiInfoboxItem.create({
            data: deserializeRecord(item),
          });
        }

        // 13. Global Objects (depends on maps and wikis)
        console.log(
          `Restoring ${migratedBackup.globalObjects.length} global objects...`
        );
        for (const obj of migratedBackup.globalObjects) {
          await tx.globalObject.create({
            data: deserializeRecord(obj),
          });
        }

        // 14. Global Areas (depends on maps and wikis)
        console.log(
          `Restoring ${migratedBackup.globalAreas.length} global areas...`
        );
        for (const area of migratedBackup.globalAreas) {
          await tx.globalArea.create({
            data: deserializeRecord(area),
          });
        }

        // 15. Media Items (depends on users)
        console.log(
          `Restoring ${migratedBackup.mediaItems.length} media items...`
        );
        for (const media of migratedBackup.mediaItems) {
          await tx.mediaItem.create({
            data: deserializeRecord(media),
          });
        }

        // 16. Canvas Style Items (depends on maps, objects, areas, etc.)
        console.log(
          `Restoring ${migratedBackup.canvasStyleItems.length} canvas style items...`
        );
        for (const style of migratedBackup.canvasStyleItems) {
          await tx.canvasStyleItem.create({
            data: deserializeRecord(style),
          });
        }

        // 17. Junction tables
        console.log(
          `Restoring ${migratedBackup.userStories.length} user stories...`
        );
        for (const userStory of migratedBackup.userStories) {
          await tx.userStory.create({
            data: deserializeRecord(userStory),
          });
        }

        console.log(`Restoring ${migratedBackup.userMaps.length} user maps...`);
        for (const userMap of migratedBackup.userMaps) {
          await tx.userMap.create({
            data: deserializeRecord(userMap),
          });
        }

        console.log(
          `Restoring ${migratedBackup.userMapHierarchies.length} user map hierarchies...`
        );
        for (const userMapHierarchy of migratedBackup.userMapHierarchies) {
          await tx.userMapHierarchy.create({
            data: deserializeRecord(userMapHierarchy),
          });
        }

        console.log(
          `Restoring ${migratedBackup.userWikis.length} user wikis...`
        );
        for (const userWiki of migratedBackup.userWikis) {
          await tx.userWiki.create({
            data: deserializeRecord(userWiki),
          });
        }

        console.log("Restore completed successfully!");
      },
      {
        timeout: 600000, // 10 minute timeout for large databases
      }
    );

    return Response.json({
      success: true,
      message: "Database restored successfully",
      restored: migratedBackup.metadata.recordCounts,
    });
  } catch (error: any) {
    console.error("Restore failed:", error);
    return Response.json(
      {
        error: "Restore failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper to deserialize records
function deserializeRecord(record: any) {
  const deserialized: any = {};

  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      // Convert ISO strings back to Date objects
      deserialized[key] = new Date(value);
    } else {
      deserialized[key] = value;
    }
  }

  return deserialized;
}

// Version parsing helper
function parseVersion(version: string) {
  const [major, minor, patch] = version.split(".").map(Number);
  return { major, minor, patch };
}

// Migration logic
async function migrateBackup(backup: any, fromVersion: any, toVersion: any) {
  let migrated = { ...backup };

  // Example: Migrate from v1.0.0 to v1.1.0
  if (
    fromVersion.major === 1 &&
    fromVersion.minor === 0 &&
    toVersion.minor >= 1
  ) {
    migrated = migrateV1_0_to_V1_1(migrated);
  }

  // Chain more migrations as needed

  // Update metadata
  migrated.metadata.version = `${toVersion.major}.${toVersion.minor}.${toVersion.patch}`;
  migrated.metadata.migratedFrom = backup.metadata.version;
  migrated.metadata.migratedAt = new Date().toISOString();

  return migrated;
}

function migrateV1_0_to_V1_1(backup: any) {
  // Example: Add default values for new fields
  return {
    ...backup,
    users: backup.users.map((user: any) => ({
      ...user,
      // Add any new fields with defaults
      newFieldAddedInV1_1: user.newFieldAddedInV1_1 || "default_value",
    })),
  };
}
