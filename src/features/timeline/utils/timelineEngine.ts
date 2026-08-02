import type { TimelineEvent } from "../../../types/timeline.types";

export interface TimelineEngineState {
  currentTime: number;
  visibleEvents: TimelineEvent[];
}

export interface TimelineTickResult {
  currentTime: number;
  visibleEvents: TimelineEvent[];
  completed: boolean;
}

/**
 * Advances the simulation clock.
 *
 * deltaMs = real elapsed milliseconds
 * speed = 1 | 2 | 5
 */
export function tickTimeline(
  events: TimelineEvent[],
  state: TimelineEngineState,
  deltaMs: number,
  speed: number,
  endTime: number
): TimelineTickResult {
  const nextTime = state.currentTime + deltaMs * speed;

  const visibleEvents = events.filter(
    (event) => new Date(event.timestamp).getTime() <= nextTime
  );

  return {
    currentTime: Math.min(nextTime, endTime),
    visibleEvents,
    completed: nextTime >= endTime,
  };
}

/**
 * Jump the replay back to the beginning.
 */
export function resetTimeline(
  startTime: number
): TimelineEngineState {
  return {
    currentTime: startTime,
    visibleEvents: [],
  };
}

/**
 * Jump directly to any timestamp.
 */
export function seekTimeline(
  events: TimelineEvent[],
  timestamp: number
): TimelineEngineState {
  return {
    currentTime: timestamp,
    visibleEvents: events.filter(
      (event) =>
        new Date(event.timestamp).getTime() <= timestamp
    ),
  };
}

/**
 * Returns events inside a time window.
 * Useful later for charts / heatmaps.
 */
export function eventsBetween(
  events: TimelineEvent[],
  start: number,
  end: number
): TimelineEvent[] {
  return events.filter((event) => {
    const time = new Date(event.timestamp).getTime();

    return time >= start && time <= end;
  });
}

/**
 * Returns only events matching a category.
 */
export function filterByCategory(
  events: TimelineEvent[],
  category: string
) {
  return events.filter(
    (event) => event.category === category
  );
}

/**
 * Returns only events matching severity.
 */
export function filterBySeverity(
  events: TimelineEvent[],
  severity: string
) {
  return events.filter(
    (event) => event.severity === severity
  );
}