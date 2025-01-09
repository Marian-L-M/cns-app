import MapEditor from "@/components/editors/MapEditor";

interface Props {
  params: {
    id: string;
  };
}

const MapAreaEditor = async ({ params }: Props) => {
  const id = parseInt(params.id);

  // Imperfect validation, will return false even if letters are mixed with numbers
  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  return (
    <div>
      <MapEditor id={id} editorMode={"object"} />
    </div>
  );
};

export default MapAreaEditor;

// 250109 Issue: Icon is not rendered on initial selection of thumbnail
