import MapEditor from "@/components/editors/MapEditor";

interface MapAreaEditorProps {
  params: {
    id: string;
  };
  searchParams: {};
}

export default async function NewMapAreaEditor({ params }: MapAreaEditorProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  return (
    <div>
      <MapEditor id={id} editorMode={"area"} />
    </div>
  );
}

// 250109 Issue: Cannot draw area markers on a new area object.
