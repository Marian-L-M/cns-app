import { Heart } from "lucide-react";

const EntryRating = (rating: number) => {
  return (
    <>
      <Heart className={`${rating >= 1 ? "text-red-500" : "text-muted"}`} />
      <Heart className={`${rating >= 2 ? "text-red-500" : "text-muted"}`} />
      <Heart className={`${rating >= 3 ? "text-red-500" : "text-muted"}`} />
    </>
  );
};

export default EntryRating;
