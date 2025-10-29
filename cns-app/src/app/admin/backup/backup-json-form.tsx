"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function BackupJsonPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch("/api/backup/json");

      if (!response.ok) {
        throw new Error("Backup failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Backup exported successfully!`);
    } catch (error: any) {
      toast.error("Backup failed", {
        className: "error",
        description: `ERROR! ${error.message}`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      // Show confirmation dialog
      const confirmed = window.confirm(
        `WARNING: This will DELETE ALL existing data and restore from backup.\n\n` +
          `Backup date: ${new Date(
            backup.metadata.timestamp
          ).toLocaleString()}\n` +
          `Total records: ${backup.metadata.recordCounts.totalRecords}\n\n` +
          `Are you absolutely sure you want to proceed?`
      );

      if (!confirmed) {
        setIsImporting(false);
        return;
      }

      const response = await fetch("/api/backup/json/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backup),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Restore failed");
      }

      toast.success(
        `Database restored successfully! ${JSON.stringify(result.restored)}`
      );

      // Refresh after success to avoid confusion
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      toast.error("Database import failed", {
        className: "error",
        description: `ERROR! ${error.message}`,
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="space-y-6">
        {/* Export Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Export Database</h2>
          <p className="text-gray-600 mb-4">
            Download a complete backup of your database as a JSON file.
          </p>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isExporting ? "Exporting..." : "Export Backup"}
          </button>
        </div>

        {/* Import Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-700">
            ⚠️ <strong>Warning:</strong> Restoring a backup will DELETE ALL
            existing data. Make sure to create a backup before restoring and
            making changes to the Database schema.
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Restore Database</h2>
          <p className="text-gray-600 mb-4">
            Upload a backup JSON file to restore your database. This will
            replace ALL current data.
          </p>
          <div className="flex gap-2">
            <Input
              id="fileUpload"
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="disabled:opacity-50"
            />
            <Button variant={"secondary"} asChild>
              <Label
                htmlFor="fileUpload"
                className="p-2 cursor-pointer hover:opacity-80"
              >
                Choose File
              </Label>
            </Button>
          </div>
          {isImporting && (
            <p className="mt-2 text-sm text-gray-500">
              Restoring... This may take several minutes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
