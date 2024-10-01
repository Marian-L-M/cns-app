"use client";
import { useState } from "react";
import Tabs from "./Tabs";
import PresetView from "./PresetView";
import CustomView from "./CustomView";
import { AnimatePresence, motion } from "framer-motion";

const tabs = ["Preset", "Custom"];

const ColorPanel = () => {
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
            <PresetView />
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
            <CustomView />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ColorPanel;
