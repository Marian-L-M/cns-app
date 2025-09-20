"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import CustomView from "./CustomView";
import PresetView from "./PresetView";
import Tabs from "./Tabs";

const tabs = ["Preset", "Custom"];

interface ViewProps {
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  editorContext: string;
}

export default function ColorPanel({
  setOpenColorPicker,
  editorContext,
}: ViewProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <>
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <AnimatePresence mode="wait">
        {selectedTab === "Preset" && (
          <motion.div
            key="preset"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
          >
            <PresetView
              setOpenColorPicker={setOpenColorPicker}
              editorContext={editorContext}
            />
          </motion.div>
        )}
        {selectedTab === "Custom" && (
          <motion.div
            key="custom"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
          >
            <CustomView setOpenColorPicker={setOpenColorPicker} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
