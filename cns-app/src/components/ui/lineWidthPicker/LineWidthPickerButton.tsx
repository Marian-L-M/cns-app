import clsx from "clsx";
import { motion } from "framer-motion";

interface ButtonProps {
  icon: React.ReactNode;
  openLineWidthPicker: boolean;
  setOpenLineWidthPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const LineWidthButton = (props: ButtonProps) => {
  const { icon, openLineWidthPicker, setOpenLineWidthPicker } = props;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "text-sm h-10 bg-slate-900 font-medium rounded-full border border-slate-600 p-2 relative transition-colors duration-75 text-slate-500",
        openLineWidthPicker ? "text-slate-300" : "text-slate-500"
      )}
      onClick={() => setOpenLineWidthPicker(!openLineWidthPicker)}
    >
      {icon}
    </motion.button>
  );
};

export default LineWidthButton;
