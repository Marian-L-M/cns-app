"use client";
import { createContext, useState, ReactNode } from "react";

interface CursorContextType {
  mouseTooltip: TooltipStatus | null;
  showMouseTooltip: (tooltipData: TooltipStatus) => void;
  hideMouseTooltip: () => void;
}

interface CursorContextProviderProps {
  children: ReactNode;
}

export const CursorContext = createContext<CursorContextType>({
  mouseTooltip: null,
  showMouseTooltip: () => {},
  hideMouseTooltip: () => {},
});

export default function CursorContextProvider({
  children,
}: CursorContextProviderProps) {
  const [mouseTooltip, setMouseTooltip] = useState<TooltipStatus | null>(null);

  const showMouseTooltip = (tooltipData: TooltipStatus) =>
    setMouseTooltip(tooltipData);
  const hideMouseTooltip = () => setMouseTooltip(null);

  return (
    <CursorContext.Provider
      value={{
        mouseTooltip,
        showMouseTooltip,
        hideMouseTooltip,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}
