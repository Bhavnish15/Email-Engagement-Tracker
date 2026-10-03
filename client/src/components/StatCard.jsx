import { motion } from "motion/react";

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "violet",
  delay = 0,
}) {
  const accents = {
    violet:
      "from-violet-500/15 to-violet-500/[0.02] text-violet-400",
    blue:
      "from-blue-500/15 to-blue-500/[0.02] text-blue-400",
    emerald:
      "from-emerald-500/15 to-emerald-500/[0.02] text-emerald-400",
    amber:
      "from-amber-500/15 to-amber-500/[0.02] text-amber-400",
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
      }}
      whileHover={{
        y: -3,
      }}
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-white/[0.065]
        bg-[#0d1017]/90
        p-5
        shadow-[0_12px_35px_rgba(0,0,0,.18)]
      "
    >
      <div
        className={`
          absolute inset-0
          bg-gradient-to-br
          opacity-70
          ${accents[accent]}
        `}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              {label}
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
              {value}
            </p>
          </div>

          <div
            className="
              flex size-10 items-center justify-center
              rounded-xl
              border border-white/[0.06]
              bg-white/[0.04]
            "
          >
            <Icon className="size-[18px]" />
          </div>
        </div>

        <p className="mt-4 text-xs text-zinc-600">
          {description}
        </p>
      </div>
    </motion.div>
  );
}