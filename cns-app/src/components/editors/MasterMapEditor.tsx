"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import Image from "next/image";

import { useMasterMapEditor } from "@/hooks/useMasterMapEditor";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MasterMapSchema } from "@/ValidationSchemas/maps";
import { MapHierarchyMaster, MapHierarchyChild } from "@prisma/client";

export type MasterMapFormData = z.infer<typeof masterMapSchema> & {
  MasterMap: MapHierarchyMaster;
};

interface MasterMapProps {
  MasterMap?: MapHierarchyMaster;
}

function MasterMapEditor({ MasterMap }: MasterMapProps) {
  const childMaps: any = [];
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Set canvas
  const { canvasRef } = useMasterMapEditor({ childMaps });
  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  // Set Form
  const form = useForm<MasterMapFormData>({
    resolver: zodResolver(MasterMapSchema),
  });

  async function onSubmit(values: MasterMapFormData) {}

  return (
    <div className="w-full" id="map-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          className="relative z-10 max-w-screen-lg col-span-4 bg-black"
          id="map-base"
        >
          <canvas
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
            className="border border-grey relative z-10 w-full"
          />
          <Image
            priority={true}
            className="absolute top-0 left-0 z-1 pointer-events-none opacity-70"
            src={`/maps/kamolin-map.jpg`} // make dynamic
            alt="Map of Kamolin"
            width="1024"
            height="1024"
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative z-20 col-span-2 flex flex-col gap-4"
            id="sidebar"
          >
            <div className="w-full flex flex-col gap-4" id="form-top"></div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default MasterMapEditor;
