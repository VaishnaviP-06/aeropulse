interface StatusBadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger";
}

const variants = {
  success: {
    dot: "bg-status-operational",
    text: "text-status-operational",
    glow: "shadow-[0_0_8px_0_oklch(0.78_0.18_155_/_70%)]",
  },
  warning: {
    dot: "bg-status-warning",
    text: "text-status-warning",
    glow: "shadow-[0_0_8px_0_oklch(0.82_0.17_80_/_70%)]",
  },
  danger: {
    dot: "bg-status-critical",
    text: "text-status-critical",
    glow: "shadow-[0_0_8px_0_oklch(0.72_0.22_25_/_70%)]",
  },
};

export default function StatusBadge({
  label,
  variant = "success",
}: StatusBadgeProps) {
  const v = variants[variant];

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur-sm">
      <span className={`h-2 w-2 rounded-full ${v.dot} ${v.glow}`} />
      <span className={v.text}>{label}</span>
    </div>
  );
}