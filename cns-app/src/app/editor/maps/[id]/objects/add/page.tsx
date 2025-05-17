import MapEditor from "@/components/editors/MapEditor";

interface Props {
  params: {
    id: string;
  };
}

export default async function AddMapObject({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  // Imperfect validation, will return false even if letters are mixed with numbers
  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  return (
    <div>
      <MapEditor id={id} editorMode={"object"} />
    </div>
  );
}

// 250109 Issue: Icon is not rendered on initial selection of thumbnail
