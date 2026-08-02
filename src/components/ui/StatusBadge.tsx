interface StatusBadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger";
}

const variants = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export default function StatusBadge({
  label,
  variant = "success",
}: StatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium">
      <span
        className={`h-2 w-2 rounded-full ${variants[variant]}`}
      />
      {label}
    </div>
  );
}