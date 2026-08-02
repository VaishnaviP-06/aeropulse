import { TIMELINE_SEVERITIES } from "../../../types/timeline.types";

interface TimelineFiltersProps {
  category: string;
  setCategory: (value: string) => void;
  categories: string[];

  severity: string;
  setSeverity: (value: string) => void;

  search: string;
  setSearch: (value: string) => void;
}

const severities = ["All", ...TIMELINE_SEVERITIES];

export default function TimelineFilters({
  category,
  setCategory,
  categories,

  severity,
  setSeverity,

  search,
  setSearch,
}: TimelineFiltersProps) {
  return (
    <div className="glass rounded-xl border border-white/10 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Timeline Filters
        </h2>

        <p className="text-sm text-muted-foreground">
          Filter operational events by category, severity, or search term.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2"
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Severity
          </label>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2"
          >
            {severities.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Search
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flight, gate, title..."
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
