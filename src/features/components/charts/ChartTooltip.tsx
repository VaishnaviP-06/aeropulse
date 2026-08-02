interface ChartTooltipRow {
  label: string;
  value: string | number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  title?: string;
  rows?: ChartTooltipRow[];
}

/**
 * Shared tooltip shell for all AeroPulse charts.
 * Pass `active`/`title`/`rows` from a small adapter inside each chart's
 * own `content` render prop — keeps every chart's tooltip visually identical.
 */
export default function ChartTooltip({
  active,
  title,
  rows,
}: ChartTooltipProps) {
  if (!active || !rows || !rows.length) return null;

  return (
    <div
      className="
        glass-strong
        rounded-lg
        px-3.5
        py-3
        text-xs
        shadow-xl
        min-w-[150px]
      "
    >
      {title && (
        <p className="mb-2 font-semibold tracking-wide text-foreground">
          {title}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              {row.color && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
              )}
              {row.label}
            </span>

            <span className="font-semibold text-foreground">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
