import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{
        opacity: 0,
        y: 18,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}