import { Heart } from "lucide-react";
interface Props {
  rating: number; //
}
const StoryRating = ({ rating }: Props) => {
  return (
    <div className="flex justify-between">
      <Heart className={`${rating >= 1 ? "text-red-500" : "text-muted"}`} />
      <Heart className={`${rating >= 2 ? "text-red-500" : "text-muted"}`} />
      <Heart className={`${rating >= 3 ? "text-red-500" : "text-muted"}`} />
    </div>
  );
};

export default StoryRating;
