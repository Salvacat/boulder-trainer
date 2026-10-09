export const MODES = [
  "countdown",
  "interval",
  "stopwatch",
  "amrap",
  "fortime",
  "emom",
  "tabata",
  "mix",
];
export const MODE_LABELS = {
  countdown: "Countdown",
  interval: "Intervals",
  stopwatch: "Stopwatch",
  amrap: "AMRAP",
  fortime: "For Time",
  emom: "EMOM",
  tabata: "Tabata",
  mix: "MIX",
};
export const DEFAULT_CONFIG = {
  mode: "countdown",
  duration: 180,
  work: 20,
  rest: 10,
  rounds: 8,
  sets: 1,
  setRest: 60,
  interval: 60,
  intro: 10,
  timeCap: 0,
  display: "down",
  deathBy: false,
  repsStart: 1,
  repsStep: 1,
  mixRepeats: 1,
  blocks: [],
};

const number = (value, fallback, min, max) => {
  const n = Number(value);
  return Math.min(
    max,
    Math.max(min, Number.isFinite(n) ? Math.floor(n) : fallback),
  );
};
export function normalizeConfig(value = {}) {
  const c = { ...DEFAULT_CONFIG, ...value };
  c.mode = MODES.includes(c.mode) ? c.mode : "countdown";
  for (const key of ["duration", "work", "interval"])
    c[key] = number(c[key], DEFAULT_CONFIG[key], 1, 86400);
  for (const key of ["rest", "setRest", "intro", "timeCap"])
    c[key] = number(c[key], DEFAULT_CONFIG[key], 0, 86400);
  for (const key of ["rounds", "sets", "mixRepeats", "repsStart", "repsStep"])
    c[key] = number(c[key], DEFAULT_CONFIG[key], 1, 100);
  c.display = c.display === "up" ? "up" : "down";
  c.deathBy = !!c.deathBy;
  c.blocks = Array.isArray(c.blocks)
    ? c.blocks.slice(0, 100).map((b) => ({ ...b }))
    : [];
  return c;
}

export function buildPhases(raw) {
  const config = normalizeConfig(raw);
  const phases = [];
  const add = (duration, kind, label, extra = {}) => {
    if (phases.length >= 2000)
      throw new Error(
        "This workout is too large. Reduce rounds, sets or repeats.",
      );
    if (duration > 0) phases.push({ duration, kind, label, ...extra });
  };
  if (config.intro) add(config.intro, "prepare", "Get ready");
  const expand = (rawBlock, label, blockNumber) => {
    const c = normalizeConfig(rawBlock);
    if (["work", "rest"].includes(rawBlock.mode)) {
      add(c.duration, rawBlock.mode, label, {
        mode: rawBlock.mode,
        block: blockNumber,
      });
      return;
    }
    for (let set = 1; set <= c.sets; set++) {
      const meta = { mode: c.mode, set, sets: c.sets, block: blockNumber };
      if (c.mode === "interval" || c.mode === "tabata") {
        for (let round = 1; round <= c.rounds; round++) {
          add(c.work, "work", label, { ...meta, round, rounds: c.rounds });
          // Tabata includes its final recovery; intervals finish on the final work period.
          if (round < c.rounds || c.mode === "tabata")
            add(c.rest, "rest", "Recovery", {
              ...meta,
              round,
              rounds: c.rounds,
            });
        }
      } else if (c.mode === "emom") {
        if (c.deathBy)
          add(Infinity, "work", label, {
            ...meta,
            deathBy: true,
            interval: c.interval,
            repsStart: c.repsStart,
            repsStep: c.repsStep,
          });
        else
          for (let round = 1; round <= c.rounds; round++)
            add(c.interval, "work", label, {
              ...meta,
              round,
              rounds: c.rounds,
            });
      } else
        add(
          c.mode === "stopwatch" || (c.mode === "fortime" && !c.timeCap)
            ? Infinity
            : c.mode === "fortime"
              ? c.timeCap
              : c.duration,
          "work",
          label,
          meta,
        );
      if (set < c.sets) add(c.setRest, "rest", "Rest between sets", meta);
    }
  };
  if (config.mode === "mix") {
    if (!config.blocks.length) throw new Error("Add at least one MIX block.");
    for (let repeat = 1; repeat <= config.mixRepeats; repeat++) {
      config.blocks.forEach((b, index) => {
        // A repeat group repeats a selected section, without duplicating its blocks.
        if (b.mode === "repeat") {
          if (
            index === 0 ||
            Number(b.from) > Number(b.to) ||
            Number(b.to) > index
          )
            throw new Error(
              "A repeat section must refer to preceding blocks, from first to last.",
            );
          const start = number(b.from, 1, 1, index);
          const end = number(b.to, index, start, index);
          const times = number(b.repeat, 2, 1, 100);
          for (let r = 1; r < times; r++)
            config.blocks
              .slice(start - 1, end)
              .filter((x) => x.mode !== "repeat")
              .forEach((x) =>
                expand(
                  x,
                  `${x.label || MODE_LABELS[x.mode] || x.mode} · repeat ${r + 1}/${times}`,
                  index + 1,
                ),
              );
        } else expand(b, b.label || MODE_LABELS[b.mode] || b.mode, index + 1);
      });
    }
  } else expand(config, MODE_LABELS[config.mode], 1);
  return phases;
}

export function newRun(now = Date.now()) {
  return {
    id: `timer-${now}-${Math.random().toString(36).slice(2, 8)}`,
    index: 0,
    phaseElapsed: 0,
    elapsed: 0,
    status: "ready",
    updatedAt: now,
    countedRounds: 0,
    splits: [],
  };
}
export function advanceRun(run, seconds, phases) {
  if (run.status !== "running") return run;
  let next = { ...run },
    remaining = Math.max(0, seconds);
  while (next.index < phases.length) {
    const phase = phases[next.index];
    const consumed = Math.min(
      remaining,
      Math.max(0, phase.duration - next.phaseElapsed),
    );
    // Preparation is not part of the athlete's score or round splits.
    if (phase.kind !== 'prepare') next.elapsed += consumed;
    next.phaseElapsed += consumed;
    remaining -= consumed;
    if (next.phaseElapsed < phase.duration) break;
    next.index++;
    next.phaseElapsed = 0;
    if (remaining <= 0 && next.index < phases.length) break;
  }
  if (next.index >= phases.length) next.status = "complete";
  return next;
}
export function advanceTo(run, now, phases) {
  return {
    ...advanceRun(run, Math.max(0, now - run.updatedAt) / 1000, phases),
    updatedAt: now,
  };
}
export function nextPhase(run, phases) {
  if (run.status === "complete") return run;
  const phase = phases[run.index];
  if (phase?.deathBy)
    return {
      ...run,
      phaseElapsed:
        (Math.floor(run.phaseElapsed / phase.interval) + 1) * phase.interval,
    };
  const index = run.index + 1;
  return {
    ...run,
    index,
    phaseElapsed: 0,
    status: index >= phases.length ? "complete" : run.status,
  };
}
export function roundSplit(run) {
  const last = run.splits.at(-1)?.elapsed || 0;
  return {
    ...run,
    countedRounds: run.countedRounds + 1,
    splits: [
      ...run.splits,
      {
        round: run.countedRounds + 1,
        elapsed: run.elapsed,
        split: run.elapsed - last,
      },
    ],
  };
}
export function formatTime(seconds, up = false) {
  if (!Number.isFinite(seconds)) return "—";
  const total = Math.max(0, up ? Math.floor(seconds) : Math.ceil(seconds));
  const h = Math.floor(total / 3600),
    m = Math.floor(total / 60) % 60,
    s = total % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
export function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
