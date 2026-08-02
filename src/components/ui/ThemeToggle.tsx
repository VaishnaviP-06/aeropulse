import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { useThemeStore } from "../../store/theme.store";


export default function ThemeToggle(){

  const {
    theme,
    toggleTheme,
  } = useThemeStore();


  return (
    <button
      onClick={toggleTheme}
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        hover:bg-muted
      "
    >

      <motion.div
        animate={{
          rotate:
            theme==="dark"
              ? 180
              : 0,
        }}
      >

        {
          theme==="dark"
          ?
          <Moon size={16}/>
          :
          <Sun size={16}/>
        }

      </motion.div>

    </button>
  );
}