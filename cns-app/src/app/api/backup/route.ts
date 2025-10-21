// pages/api/backup.ts
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { DATABASE_URL_UNPOOLED } from "@/lib/constants";

const prisma = new PrismaClient();

// Using pg_dump to create a database backup
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!(session?.user.role === "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const backupFilename = `backup_${timestamp}.dump`;
    const backupPath = path.join(process.cwd(), "public", backupFilename);

    execSync(
      `pg_dump --dbname=${DATABASE_URL_UNPOOLED} --format=custom --file=${backupPath}`
    );

    const backupData = fs.readFileSync(backupPath);
    const response = new NextResponse(new Uint8Array(backupData), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${backupFilename}"`,
      },
    });

    // Clean up
    fs.unlinkSync(backupPath);

    return response;
  } catch (error) {
    console.error("Error generating database backup:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Restore database from SQL backup
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!(session?.user.role === "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.name);

    // Read file as ArrayBuffer for binary data
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    fs.writeFileSync(tempFilePath, buffer);

    execSync(
      `pg_restore --dbname=${DATABASE_URL_UNPOOLED} --clean ${tempFilePath}`,
      { stdio: "inherit" }
    );

    fs.unlinkSync(tempFilePath);

    return NextResponse.json({ message: "Database restored successfully" });
  } catch (error) {
    console.error("Error restoring database:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
