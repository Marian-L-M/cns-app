// src/app/admin/backup/backup-form.tsx
"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function BackupForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleBackup() {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/backup", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || "database_backup.dump";

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Backup created successfully.");
    } catch (error) {
      console.error("Error generating backup:", error);
      toast.error("Backup creation failed.", {
        className: "error",
        description: `ERROR! ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleBackup} disabled={isLoading} className="max-w-sm">
        {isLoading ? "Generating Backup..." : "Download Backup"}
      </Button>
    </div>
  );
}
