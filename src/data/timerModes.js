import { DEFAULT_CONFIG } from "../utils/workoutTimer.js";
export const TIMER_MODES = [
  {
    mode: "amrap",
    title: "AMRAP",
    subtitle: "As many rounds as possible",
    detail: "Set a time. Find your pace.",
    color: "lime",
    config: { duration: 600 },
  },
  {
    mode: "fortime",
    title: "For Time",
    subtitle: "Finish at your own pace",
    detail: "Race the clock, with an optional cap.",
    color: "orange",
    config: { display: "up", timeCap: 0 },
  },
  {
    mode: "emom",
    title: "EMOM",
    subtitle: "Every minute, on the minute",
    detail: "A fresh start each interval.",
    color: "cyan",
    config: { interval: 60, rounds: 10 },
  },
  {
    mode: "tabata",
    title: "Tabata",
    subtitle: "Work. Recover. Repeat.",
    detail: "20s work / 10s rest · 8 rounds",
    color: "lime",
    config: { work: 20, rest: 10, rounds: 8 },
  },
  {
    mode: "mix",
    title: "MIX",
    subtitle: "Build a complete workout",
    detail: "Combine formats, work and rest.",
    color: "orange",
    config: {},
  },
  {
    mode: "interval",
    title: "Intervals",
    subtitle: "Your work-to-rest rhythm",
    detail: "Flexible holds, reps and recovery.",
    color: "cyan",
    config: { work: 30, rest: 60, rounds: 6 },
  },
  {
    mode: "countdown",
    title: "Countdown",
    subtitle: "One simple focus block",
    detail: "Drills, holds and recovery.",
    color: "lime",
    config: { duration: 180, intro: 0 },
  },
  {
    mode: "stopwatch",
    title: "Stopwatch",
    subtitle: "Start now, finish when ready",
    detail: "Count up and record lap splits.",
    color: "cyan",
    config: { intro: 0, display: "up" },
  },
];
export function modeConfig(mode) {
  return {
    ...DEFAULT_CONFIG,
    mode,
    ...TIMER_MODES.find((m) => m.mode === mode)?.config,
  };
}
