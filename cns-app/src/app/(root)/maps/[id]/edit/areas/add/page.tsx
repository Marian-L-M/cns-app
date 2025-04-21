import MapEditor from "@/components/editors/MapEditor";

interface MapAreaEditorProps {
  params: {
    id: string;
  };
  searchParams: {};
}

const NewMapAreaEditor = async ({ params }: MapAreaEditorProps) => {
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
};

export default NewMapAreaEditor;

// 250109 Issue: Cannot draw area markers on a new area object.
