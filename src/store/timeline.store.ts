import { create } from "zustand";
import type {
  TimelineClockState,
  TimelineEvent,
  ClockSpeed,
} from "../types/timeline.types";

interface TimelineStore {
  events: TimelineEvent[];

  visibleEvents: TimelineEvent[];

  loading: boolean;

  clock: TimelineClockState;

  setEvents: (events: TimelineEvent[]) => void;

  setVisibleEvents: (events: TimelineEvent[]) => void;

  start: () => void;

  pause: () => void;

  reset: () => void;

  setSpeed: (speed: ClockSpeed) => void;

  tick: (time: number) => void;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  events: [],

  visibleEvents: [],

  loading: false,

  clock: {
    status: "idle",
    simTime: 0,
    startTime: 0,
    endTime: 0,
    speed: 1,
  },

  setEvents(events) {
    const start =
      events.length > 0
        ? new Date(events[0].timestamp).getTime()
        : 0;

    const end =
      events.length > 0
        ? new Date(events[events.length - 1].timestamp).getTime()
        : 0;

    set({
      events,
      visibleEvents: [],
      clock: {
        status: "idle",
        simTime: start,
        startTime: start,
        endTime: end,
        speed: 1,
      },
    });
  },

  setVisibleEvents(events) {
    set({
      visibleEvents: events,
    });
  },

  start() {
    set((state) => ({
      clock: {
        ...state.clock,
        status: "running",
      },
    }));
  },

  pause() {
    set((state) => ({
      clock: {
        ...state.clock,
        status: "paused",
      },
    }));
  },

  reset() {
    const { clock } = get();

    set({
      visibleEvents: [],
      clock: {
        ...clock,
        status: "idle",
        simTime: clock.startTime,
      },
    });
  },

  setSpeed(speed) {
    set((state) => ({
      clock: {
        ...state.clock,
        speed,
      },
    }));
  },

  tick(time) {
    const { events, clock } = get();

    const visible = events.filter(
      (event) =>
        new Date(event.timestamp).getTime() <= time
    );

    set({
      visibleEvents: visible,
      clock: {
        ...clock,
        simTime: time,
      },
    });
  },
}));