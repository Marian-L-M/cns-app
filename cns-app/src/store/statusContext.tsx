"use client";
import { createContext, useState, ReactNode } from "react";

// Interface for the context value
interface StatusContextType {
  status: ClickStatus | null;
  showStatus: (statusData: ClickStatus) => void;
  hideStatus: () => void;
}

interface StatusContextProviderProps {
  children: ReactNode;
}

const StatusContext = createContext<StatusContextType>({
  status: null, // {title, subtitle, status}
  showStatus: () => {},
  hideStatus: () => {},
});

export function StatusContextProvider({
  children,
}: StatusContextProviderProps) {
  const [activeStatus, setActiveStatus] = useState<ClickStatus | null>(null);

  function showStatusHandler(statusData: ClickStatus) {
    setActiveStatus(statusData);
  }

  function hideStatusHandler() {
    setActiveStatus(null);
  }

  const context: StatusContextType = {
    status: activeStatus,
    showStatus: showStatusHandler,
    hideStatus: hideStatusHandler,
  };

  return (
    <StatusContext.Provider value={context}>{children}</StatusContext.Provider>
  );
}

export default StatusContext;
