import { useContext } from "react";
import { StatusContext } from "@/store/statusContext";

interface StoryProps {
  title: string;
  id: number;
  type: string;
  description: string;
}

function StoryBox(props: StoryProps) {
  const statusCtx = useContext(StatusContext);
  const { title, id, type, description } = props;

  return (
    <div className="placeholder-classname">
      <h2>{title}</h2>
      <h3>{type}</h3>
      <p>ID: {id}</p>
      <p>{description}</p>
      <button onClick={statusCtx.hideStoryBox}>Close Infobox</button>
    </div>
  );
}

export default StoryBox;
