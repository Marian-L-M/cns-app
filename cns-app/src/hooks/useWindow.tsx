import { useEffect, useState } from "react";

interface Props {
  aspectRatio: number;
  padding: number;
  border: number;
  fullscreen: boolean;
  availabeWidth?: number;
}

export function useWindowSize({
  aspectRatio,
  padding,
  border,
  fullscreen,
  availabeWidth,
}: Props) {
  // Default
  const [windowSize, setWindowSize] = useState({
    width: 896,
    height: 896,
  });

  useEffect(() => {
    function handleResize() {
      if (fullscreen) {
        // Fullscreen mode calculations
        const fsMaxWidthPadded = window.innerWidth - (padding + border) * 2;
        const fsMaxHeightPadded = window.innerHeight - (padding + border) * 2;

        const fsWidthToHeight = fsMaxWidthPadded / aspectRatio;
        const fsHeightToWidth = fsMaxHeightPadded * aspectRatio;

        let activeFsWidth = fsMaxWidthPadded;
        let activeFsHeight = fsWidthToHeight;

        if (fsHeightToWidth <= fsMaxWidthPadded) {
          activeFsHeight = fsMaxHeightPadded;
          activeFsWidth = fsHeightToWidth;
        }

        setWindowSize({
          width: activeFsWidth,
          height: activeFsHeight,
        });
      } else {
        // Normal mode calculations
        // const heightLimitNm = window.innerHeight * 0.9;
        const width = availabeWidth || 896; // Fallback to default
        const height = width / aspectRatio;
        // const height =
        //   calculatedHeight > heightLimitNm ? heightLimitNm : calculatedHeight;

        setWindowSize({
          width,
          height,
        });
      }
    }

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fullscreen]);

  return windowSize;
}
