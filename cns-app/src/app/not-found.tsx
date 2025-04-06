"use_client";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 justify-center h-96 p-4">
      <Image
        src="/ui/logo.png"
        alt={`${APP_NAME}-logo`}
        width={150}
        height={150}
        priority={true}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Not Found!</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button variant={`outline`} className="w-64" asChild>
          <Link href={`/`}>Return home</Link>
        </Button>
      </div>
    </div>
  );
}
