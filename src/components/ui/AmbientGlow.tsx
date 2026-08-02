import { motion } from "framer-motion";

export default function AmbientGlow() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -top-40
          -left-40
          h-96
          w-96
          rounded-full
          bg-[oklch(0.78_0.12_220)]
          opacity-[0.10]
          blur-[110px]
        "
      />

      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          top-1/3
          right-[-10rem]
          h-[28rem]
          w-[28rem]
          rounded-full
          bg-[oklch(0.72_0.19_155)]
          opacity-[0.05]
          blur-[130px]
        "
      />
    </>
  );
}