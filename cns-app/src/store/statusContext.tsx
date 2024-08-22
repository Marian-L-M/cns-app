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

// export const StatusBarContext = createContext<StatusContextType>({
//   status: null, // {title, subtitle, status}
//   showStatus: () => {},
//   hideStatus: () => {},
// });
// export const InfoBoxContext = createContext<StatusContextType>({
//   status: null, // {title, subtitle, status}
//   showStatus: () => {},
//   hideStatus: () => {},
// });
// export const StoryBoxContext = createContext<StatusContextType>({
//   status: null, // {title, subtitle, status}
//   showStatus: () => {},
//   hideStatus: () => {},
// });

// const StatusContext = createContext<StatusContextType>({
//   status: null, // {title, subtitle, status}
//   showStatus: () => {},
//   hideStatus: () => {},
// });

// export function StatusContextProvider({
//   children,
// }: StatusContextProviderProps) {
//   const [activeStatus, setActiveStatus] = useState<ClickStatus | null>(null);

//   function showStatusHandler(statusData: ClickStatus) {
//     setActiveStatus(statusData);
//   }

//   function hideStatusHandler() {
//     setActiveStatus(null);
//   }

// const StatusBarContext: StatusContextType = {
//   status: activeStatus,
//   showStatus: showStatusHandler,
//   hideStatus: hideStatusHandler,
// };
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
