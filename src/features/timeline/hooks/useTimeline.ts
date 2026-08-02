import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useTimelineStore } from "../../../store/timeline.store";
import { tickTimeline } from "../utils/timelineEngine";

import {
  generateTimelineEvents,
  type TimelineDataSources,
} from "../utils/eventGenerator";

import {
  TIMELINE_CATEGORIES,
} from "../../../types/timeline.types";

import { getFlights } from "../../../services/csv/flight.service";
import { getGateEvents } from "../../../services/csv/gate.service";
import { getPassengers } from "../../../services/csv/passenger.service";
import { getBaggage } from "../../../services/csv/baggage.service";
import { getSecurityScreening } from "../../../services/csv/security.service";
import { getMaintenanceLogs } from "../../../services/csv/maintenance.service";
import { getRetailTransactions } from "../../../services/csv/retail.service";


export function useTimeline() {

  const {
    events,
    visibleEvents,
    clock,
    setEvents,
    setVisibleEvents,
    start,
    pause,
    reset,
    setSpeed,
    tick,
  } = useTimelineStore();


  const frameRef = useRef<number | null>(null);
  const previousRef = useRef<number | null>(null);


  // Filters

  const [category, setCategory] = useState<string>("All");
  const [severity, setSeverity] = useState<string>("All");
  const [search, setSearch] = useState("");


  // Load timeline data

  const load = useCallback(async () => {

    const [
      flights,
      gateEvents,
      passengers,
      bags,
      screenings,
      maintenanceLogs,
      retailRows,
    ] = await Promise.all([
      getFlights(),
      getGateEvents(),
      getPassengers(),
      getBaggage(),
      getSecurityScreening(),
      getMaintenanceLogs(),
      getRetailTransactions(),
    ]);


    const sources: TimelineDataSources = {
      flights,
      gateEvents,
      passengers,
      bags,
      screenings,
      maintenanceLogs,
      retailRows,
    };


    setEvents(
      generateTimelineEvents(sources)
    );

  }, [setEvents]);



  useEffect(() => {

    if (events.length === 0) {
      load();
    }

  }, [events.length, load]);



  // Simulation loop

  useEffect(() => {

    if (clock.status !== "running") return;


    const loop = (now:number) => {

      if (previousRef.current === null) {
        previousRef.current = now;
      }


      const delta = now - previousRef.current;

      previousRef.current = now;


      const result = tickTimeline(
        events,
        {
          currentTime: clock.simTime,
          visibleEvents,
        },
        delta,
        clock.speed,
        clock.endTime
      );


      tick(result.currentTime);

      setVisibleEvents(
        result.visibleEvents
      );


      if (!result.completed) {
        frameRef.current =
          requestAnimationFrame(loop);
      }

    };


    frameRef.current =
      requestAnimationFrame(loop);



    return () => {

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }


      previousRef.current = null;

    };


  }, [
    clock.status,
    clock.speed,
    clock.simTime,
    clock.endTime,
    events,
    visibleEvents,
    tick,
    setVisibleEvents,
  ]);



  // Filtering

  const filteredEvents = useMemo(() => {

    const term = search
      .trim()
      .toLowerCase();


    return visibleEvents.filter((event)=>{

      const categoryMatch =
        category === "All" ||
        event.category === category;


      const severityMatch =
        severity === "All" ||
        event.severity === severity;


      const searchMatch =
        term.length === 0 ||
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.eventType.toLowerCase().includes(term) ||
        (event.flightId ?? "")
          .toLowerCase()
          .includes(term) ||
        (event.gate ?? "")
          .toLowerCase()
          .includes(term);



      return (
        categoryMatch &&
        severityMatch &&
        searchMatch
      );

    });


  }, [
    visibleEvents,
    category,
    severity,
    search,
  ]);



  const categories = [
    "All",
    ...TIMELINE_CATEGORIES,
  ];



  return {

    events,

    visibleEvents,

    filteredEvents,


    categories,


    category,
    setCategory,


    severity,
    setSeverity,


    search,
    setSearch,


    clock,


    start,
    pause,
    reset,
    setSpeed,

  };

}