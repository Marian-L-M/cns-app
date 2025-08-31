interface trunaceProps {
  text: string;
  limit: number;
}

export function truncateText({ text, limit }: trunaceProps) {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
}
