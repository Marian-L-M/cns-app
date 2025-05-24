import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import IconPickerButton from "./IconPickerButton";
import IconGrid from "./IconGrid";
import { iconList } from "@/lib/constants/objectIcons";

export default function IconPicker() {
  const [openIconPicker, setOpenIconPicker] = useState<boolean>(false);

  return (
    <div>
      <IconPickerButton
        openIconPicker={openIconPicker}
        setOpenIconPicker={setOpenIconPicker}
      />
      <AnimatePresence>
        {openIconPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <IconGrid
              iconList={iconList}
              setOpenIconPicker={setOpenIconPicker}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
