"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Capture the form reference before async operations
    const form = e.currentTarget;

    try {
      setIsLoading(true);
      if (!file) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/backup", formData);
      toast.success("Backup imported successfully.");
      setFile(null);
      form.reset(); // Use the captured reference
    } catch (error) {
      console.error("Error restoring database:", error);
      toast.error("Error importing backup.", {
        className: "error",
        description: `ERROR! ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Import Backup File</h2>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input type="file" accept=".dump" onChange={handleFileChange} />
        <Button
          type="submit"
          disabled={!file || isLoading}
          className="max-w-sm"
        >
          {isLoading ? "Uploading..." : "Import Backup File"}
        </Button>
      </form>
    </div>
  );
}
