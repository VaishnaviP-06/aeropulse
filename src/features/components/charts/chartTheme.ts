/**
 * Shared chart theme utilities.
 *
 * AeroPulse charts should never hardcode hex colors — they read the same
 * CSS custom properties (`--chart-1`..`--chart-5`, `--status-*`) that the
 * rest of the design system uses, so charts automatically stay correct in
 * both the light and dark themes.
 */

/** Resolves a CSS custom property to a usable color string (e.g. for SVG fills/strokes). */
export function cssVar(name: string): string {
  if (typeof window === "undefined") return "#5eead4";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || "#5eead4";
}

/** Categorical chart palette, in priority order. */
export const CHART_COLORS = {
  chart1: "var(--chart-1)",
  chart2: "var(--chart-2)",
  chart3: "var(--chart-3)",
  chart4: "var(--chart-4)",
  chart5: "var(--chart-5)",
} as const;

/** Semantic operational status colors — use these when a series has a clear operational meaning. */
export const STATUS_COLORS = {
  operational: "var(--status-operational)",
  warning: "var(--status-warning)",
  critical: "var(--status-critical)",
  offline: "var(--status-offline)",
} as const;

/** Shared cartesian grid styling for line/area/bar charts. */
export const CHART_GRID_PROPS = {
  strokeDasharray: "3 6",
  stroke: "var(--border)",
  vertical: false,
} as const;

/** Shared axis tick styling for line/area/bar charts. */
export const CHART_AXIS_STYLE = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
  fontFamily: "Geist Variable, sans-serif",
} as const;

/** Shared tooltip cursor styling. */
export const CHART_CURSOR_PROPS = {
  stroke: "var(--border)",
  strokeWidth: 1,
  strokeDasharray: "4 4",
} as const;
