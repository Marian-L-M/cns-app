import MapEditor from "@/components/editors/MapEditor";

interface MapAreaEditorProps {
  params: {
    id: string;
  };
  searchParams: {};
}

const NewMapAreaEditor = async ({ params }: MapAreaEditorProps) => {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  return (
    <div>
      <MapEditor id={id} />
    </div>
  );
};

export default NewMapAreaEditor;
