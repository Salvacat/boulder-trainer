// Patterns are original and deliberately differ in pitch, rhythm and direction.
export const CUE_PATTERNS = {
  prepare: [
    [440, 0.08, 0],
    [440, 0.08, 0.18],
  ],
  work: [
    [660, 0.1, 0],
    [990, 0.2, 0.15],
  ],
  rest: [
    [520, 0.12, 0],
    [330, 0.25, 0.17],
  ],
  repEnd: [
    [1200, 0.07, 0],
    [1200, 0.07, 0.12],
  ],
  complete: [
    [660, 0.12, 0],
    [880, 0.12, 0.17],
    [1320, 0.32, 0.34],
  ],
  countdown: [[780, 0.07, 0]],
  halfway: [[660, 0.08, 0]],
  minute: [[520, 0.08, 0]],
};

export function selectTimerCues(before, now, options = {}) {
  if (!before || before.id !== now.id) return [];
  if (now.status === "complete" && before.status !== "complete")
    return [{ type: "complete", words: "Workout complete" }];
  if (now.status !== "running") return [];
  if (
    before.index !== now.index ||
    before.deathRound !== now.deathRound ||
    before.status !== "running"
  ) {
    const changed =
      before.index !== now.index || before.deathRound !== now.deathRound;
    const cues =
      changed &&
      before.status === "running" &&
      before.kind === "work" &&
      now.index <= before.index + 1
        ? [{ type: "repEnd", words: "Round complete" }]
        : [];
    if (
      now.kind === "prepare" &&
      now.remaining > 0 &&
      now.remaining <= 3 &&
      options.countdown !== false
    )
      return [...cues, { type: "countdown", words: String(now.remaining) }];
    const type =
      now.kind === "rest"
        ? "rest"
        : now.kind === "prepare"
          ? "prepare"
          : "work";
    const word =
      type === "prepare" ? "Get ready" : type === "rest" ? "Rest" : "Work";
    cues.push({
      type,
      words: `${before.status === "paused" ? "Resume. " : ""}${word}${now.round ? `. Round ${now.round}` : ""}${now.label && !["Work", "Rest", "Recovery", "Get ready", "AMRAP", "EMOM", "Tabata", "For Time", "Intervals", "Countdown", "Stopwatch"].includes(now.label) ? `. ${now.label}` : ""}`,
    });
    return cues;
  }
  if (now.countedRounds > before.countedRounds)
    return [{ type: "repEnd", words: `Round ${now.countedRounds} logged` }];
  if (
    options.countdown !== false &&
    now.remaining > 0 &&
    now.remaining <= 3 &&
    before.remaining !== now.remaining
  )
    return [{ type: "countdown", words: String(now.remaining) }];
  if (
    options.halfway &&
    Number.isFinite(now.duration) &&
    now.duration >= 10 &&
    before.elapsed < now.duration / 2 &&
    now.elapsed >= now.duration / 2
  )
    return [{ type: "halfway", words: "Halfway" }];
  if (
    options.minutes &&
    now.elapsed > 0 &&
    Math.floor(before.elapsed / 60) < Math.floor(now.elapsed / 60)
  )
    return [
      { type: "minute", words: `${Math.floor(now.elapsed / 60)} minutes` },
    ];
  return [];
}

export function cueMode(settings) {
  const sound = settings.sound !== "Off";
  return settings.voice ? (sound ? "both" : "voice") : sound ? "sounds" : "off";
}
