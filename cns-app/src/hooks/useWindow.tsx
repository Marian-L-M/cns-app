import { useEffect, useState } from "react";

interface Props {
  padding: number;
  border: number;
  fullscreen: boolean;
}

export function useWindowSize({ padding, border, fullscreen }: Props) {
  const [windowSize, setWindowSize] = useState({
    width: 800,
    height: 800,
  });

  useEffect(() => {
    let height = window.innerHeight * 0.9 > 800 ? 800 : window.innerHeight;
    let width = window.innerWidth * 0.9 > 800 ? 800 : window.innerWidth;

    function handleResize() {
      setWindowSize({
        height: fullscreen
          ? window?.innerHeight - (padding + border) * 2
          : height,
        width: fullscreen ? window?.innerWidth - (padding + border) * 2 : width,
      });
    }

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fullscreen]);

  return windowSize;
}
