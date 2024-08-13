"use client";
import { createContext, useState, ReactNode } from "react";

interface StatusData {
  title: string;
  subtitle: string;
  status: string;
}

// Interface for the context value
interface StatusContextType {
  status: StatusData | null;
  showStatus: (statusData: StatusData) => void;
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
  const [activeStatus, setActiveStatus] = useState<StatusData | null>(null);

  function showStatusHandler(statusData: StatusData) {
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
