"use client";
import { createContext, useState, ReactNode } from "react";

// Interface for the context value
interface StatusContextType {
  statusBar: ClickStatus | null;
  showStatusBar: (statusData: ClickStatus) => void;
  hideStatusBar: () => void;
  infoBox: ClickStatus | null;
  showInfoBox: (statusData: ClickStatus) => void;
  hideInfoBox: () => void;
  storyBox: StoryClickStatus | null;
  showStoryBox: (statusData: StoryClickStatus) => void;
  hideStoryBox: () => void;
}

interface StatusContextProviderProps {
  children: ReactNode;
}

// Define the context
export const StatusContext = createContext<StatusContextType>({
  statusBar: null,
  infoBox: null,
  storyBox: null,
  showStatusBar: () => {},
  hideStatusBar: () => {},
  showInfoBox: () => {},
  hideInfoBox: () => {},
  showStoryBox: () => {},
  hideStoryBox: () => {},
});

export default function StatusContextProvider({
  children,
}: StatusContextProviderProps) {
  const [statusBar, setStatusBar] = useState<ClickStatus | null>(null);
  const [infoBox, setInfoBox] = useState<ClickStatus | null>(null);
  const [storyBox, setStoryBox] = useState<ClickStatus | null>(null);

  // Handlers for showing and hiding statuses
  const showStatusBar = (statusData: ClickStatus) => setStatusBar(statusData);
  const hideStatusBar = () => setStatusBar(null);

  const showInfoBox = (statusData: ClickStatus) => setInfoBox(statusData);
  const hideInfoBox = () => setInfoBox(null);

  const showStoryBox = (statusData: StoryClickStatus) =>
    setStoryBox(statusData);
  const hideStoryBox = () => setStoryBox(null);

  // TOdo: 241003
  // Fix typing issue* StoryClickStatus requires a description field (Normal ClickStatus does not)
  // statusData cannot be used for both types

  return (
    <StatusContext.Provider
      value={{
        statusBar,
        infoBox,
        storyBox,
        showStatusBar,
        hideStatusBar,
        showInfoBox,
        hideInfoBox,
        showStoryBox,
        hideStoryBox,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}
