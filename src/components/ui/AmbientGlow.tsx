import { motion } from "framer-motion";

const blobs = [
  {
    color: "#6bc8ff",
    size: "44rem",
    top: "-10%",
    left: "-8%",
    opacity: 0.07,
    duration: 22,
    range: [30, -20],
  },
  {
    color: "#1f3b67",
    size: "38rem",
    top: "20%",
    left: "70%",
    opacity: 0.1,
    duration: 28,
    range: [-25, 15],
  },
  {
    color: "#101a2e",
    size: "50rem",
    top: "60%",
    left: "10%",
    opacity: 0.12,
    duration: 34,
    range: [20, -30],
  },
  {
    color: "#6bc8ff",
    size: "34rem",
    top: "75%",
    left: "75%",
    opacity: 0.06,
    duration: 26,
    range: [-15, 20],
  },
];

export default function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, b.range[0], 0],
            y: [0, b.range[1], 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: b.color,
            opacity: b.opacity,
          }}
          className="absolute rounded-full blur-[110px]"
        />
      ))}
    </div>
  );
}