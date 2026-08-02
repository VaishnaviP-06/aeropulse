import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Props {
  label:string;
  value:string | number;
  description:string;
  icon:LucideIcon;
}

export default function FlightMetricCard({
  label,
  value,
  description,
  icon:Icon,
}:Props){

  return (
    <motion.div
      initial={{
        opacity:0,
        y:15
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        duration:0.4
      }}
      className="
        glass
        rounded-xl
        p-5
        relative
        overflow-hidden
      "
    >

      <div
        className="
          absolute
          inset-0
          bg-cyan-400/5
          opacity-0
          hover:opacity-100
          transition
        "
      />

      <div className="relative">

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-widest
              text-muted-foreground
            "
          >
            {label}
          </p>


          <Icon
            size={18}
            className="
              text-cyan-400
            "
          />

        </div>


        <h2
          className="
            mt-4
            text-3xl
            font-semibold
            text-gradient
          "
        >
          {value}
        </h2>


        <p
          className="
            mt-1
            text-xs
            text-muted-foreground
          "
        >
          {description}
        </p>

      </div>

    </motion.div>
  );
}