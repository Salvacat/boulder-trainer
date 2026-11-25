import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPhases,
  newRun,
  advanceRun,
  advanceTo,
  nextPhase,
  roundSplit,
  formatTime,
  normalizeConfig,
  completedIntervals,
} from "../src/utils/workoutTimer.js";
import {
  BODY_TENSION_DRILLS,
  BODY_TENSION_SESSION,
} from "../src/data/bodyTension.js";
const running = () => ({ ...newRun(1000), status: "running" });
const length = (config) =>
  buildPhases({ intro: 0, ...config }).reduce((sum, p) => sum + p.duration, 0);

test("Tabata finishes on its eighth work interval with no trailing recovery", () => {
  const phases = buildPhases({ mode: "tabata", intro: 0 });
  assert.equal(length({ mode: "tabata" }), 230);
  assert.equal(phases.length, 15);
  assert.equal(phases.at(-1).kind, "work");
  const lastWork = advanceRun(running(), 210, phases);
  assert.equal(phases[lastWork.index].round, 8);
  assert.equal(lastWork.status, "running");
  const done = advanceRun(lastWork, 20, phases);
  assert.equal(done.status, "complete");
  assert.equal(done.elapsed, 230);
  assert.equal(completedIntervals(done, phases), 8);
});

test("single-round Tabata ends on work; multiple sets retain only their configured set rest", () => {
  const single = buildPhases({ mode: "tabata", intro: 0, rounds: 1 });
  assert.deepEqual(
    single.map((p) => p.kind),
    ["work"],
  );
  assert.equal(advanceRun(running(), 20, single).status, "complete");
  const multi = buildPhases({
    mode: "tabata",
    intro: 0,
    rounds: 2,
    sets: 2,
    setRest: 30,
  });
  assert.deepEqual(
    multi.map((p) => p.kind),
    ["work", "rest", "work", "rest", "work", "rest", "work"],
  );
  assert.equal(multi[3].label, "Rest between sets");
  assert.equal(multi[3].duration, 30);
  assert.equal(advanceRun(running(), 130, multi).status, "complete");
});

test("Tabata inside MIX ends on work while explicitly programmed rest blocks remain", () => {
  const mix = buildPhases({
    mode: "mix",
    intro: 0,
    blocks: [
      { mode: "tabata", rounds: 1, work: 5, rest: 10 },
      { mode: "rest", duration: 7, label: "Intentional recovery" },
    ],
  });
  assert.deepEqual(
    mix.map((p) => [p.kind, p.duration]),
    [
      ["work", 5],
      ["rest", 7],
    ],
  );
});
test("interval workouts end on work and sets rest only between sets", () => {
  assert.equal(length({ mode: "interval", work: 10, rest: 5, rounds: 3 }), 40);
  assert.equal(
    length({ mode: "amrap", duration: 60, sets: 3, setRest: 30 }),
    240,
  );
});
test("a background tick catches up across all phases and stops at exact planned finish", () => {
  const p = buildPhases({
    mode: "interval",
    intro: 3,
    work: 10,
    rest: 5,
    rounds: 3,
  });
  const halfway = advanceTo(running(), 26000, p);
  assert.equal(halfway.index, 3);
  assert.equal(halfway.phaseElapsed, 7);
  assert.equal(halfway.elapsed, 22);
  const done = advanceTo(halfway, 600000, p);
  assert.equal(done.status, "complete");
  assert.equal(done.elapsed, 40);
});
test("pause excludes wall clock time and JSON snapshots resume accurately", () => {
  const p = buildPhases({ mode: "countdown", duration: 60, intro: 0 });
  let r = advanceTo(running(), 11000, p);
  r = { ...r, status: "paused" };
  r = advanceTo(JSON.parse(JSON.stringify(r)), 101000, p);
  assert.equal(r.elapsed, 10);
  r = advanceTo({ ...r, status: "running", updatedAt: 101000 }, 106000, p);
  assert.equal(r.elapsed, 15);
});
test("uncapped For Time waits for Finish set then begins rest and next set", () => {
  const p = buildPhases({
    mode: "fortime",
    timeCap: 0,
    intro: 0,
    sets: 2,
    setRest: 30,
  });
  let r = advanceRun(running(), 5000, p);
  assert.equal(r.index, 0);
  r = nextPhase(r, p);
  assert.equal(p[r.index].kind, "rest");
  assert.equal(r.elapsed, 5000);
  r = advanceRun(r, 30, p);
  assert.equal(p[r.index].set, 2);
  assert.equal(r.status, "running");
  assert.equal(nextPhase(r, p).status, "complete");
});
test("EMOM interval boundaries, custom interval and Death By remain open-ended", () => {
  assert.equal(length({ mode: "emom", interval: 90, rounds: 5 }), 450);
  const p = buildPhases({
    mode: "emom",
    interval: 60,
    intro: 0,
    deathBy: true,
  });
  const r = advanceRun(running(), 125, p);
  assert.equal(r.status, "running");
  assert.equal(Math.floor(r.phaseElapsed / p[0].interval) + 1, 3);
});
test("MIX expands labeled blocks, section repeats, whole-flow repeats and individual formats", () => {
  const config = {
    mode: "mix",
    intro: 0,
    mixRepeats: 2,
    blocks: [
      { mode: "amrap", duration: 10, label: "Tension" },
      { mode: "rest", duration: 5 },
      { mode: "repeat", from: 1, to: 2, repeat: 3 },
      { mode: "emom", rounds: 2, interval: 10 },
    ],
  };
  assert.equal(length(config), 130);
  assert.equal(buildPhases(config)[0].label, "Tension");
  assert.throws(() => buildPhases({ mode: "mix", blocks: [] }), /Add at least/);
  assert.throws(
    () => buildPhases({ mode: "mix", blocks: [{ mode: "repeat" }] }),
    /preceding/,
  );
});
test("skipping rest keeps actual elapsed time and round splits capture laps", () => {
  const p = buildPhases({
    mode: "interval",
    work: 10,
    rest: 20,
    rounds: 2,
    intro: 0,
  });
  let r = advanceRun(running(), 12, p);
  r = nextPhase(r, p);
  assert.equal(r.elapsed, 12);
  assert.equal(r.index, 2);
  r = roundSplit(r);
  r = roundSplit(advanceRun(r, 5, p));
  assert.deepEqual(
    r.splits.map((s) => s.split),
    [12, 5],
  );
});
test("input bounds and hour formatting", () => {
  assert.equal(normalizeConfig({ work: -5 }).work, 1);
  assert.equal(normalizeConfig({ sets: 20000 }).sets, 100);
  assert.equal(formatTime(3605), "1:00:05");
  assert.equal(formatTime(2.1), "00:03");
  assert.equal(formatTime(2.9, true), "00:02");
});

test("small browser ticks retain exact millisecond timing at phase boundaries", () => {
  const phases = buildPhases({
    mode: "tabata",
    intro: 3,
    work: 4,
    rest: 4,
    rounds: 2,
  });
  let run = running();
  for (let i = 0; i < 150; i++) run = advanceRun(run, 0.1, phases);
  assert.equal(run.status, "complete");
  assert.equal(run.elapsed, 12);
  assert.equal(formatTime(run.elapsed, true), "00:12");
});

test("completed intervals are counted without requiring manual lap taps", () => {
  const phases = buildPhases({
    mode: "tabata",
    work: 2,
    rest: 2,
    rounds: 2,
    intro: 0,
  });
  const firstRest = advanceRun(running(), 2, phases);
  assert.equal(completedIntervals(firstRest, phases), 1);
  const done = advanceRun(firstRest, 6, phases);
  assert.equal(done.countedRounds, 0);
  assert.equal(completedIntervals(done, phases), 2);
});
test("complete dated program has all sixteen drills and suggested 120-minute flow", () => {
  assert.equal(BODY_TENSION_DRILLS.length, 16);
  assert.equal(new Set(BODY_TENSION_DRILLS.map((d) => d.id)).size, 16);
  assert.equal(
    BODY_TENSION_SESSION.blocks.reduce((sum, b) => sum + b.minutes, 0),
    120,
  );
  BODY_TENSION_SESSION.blocks.forEach((b) =>
    b.ids.forEach((id) =>
      assert.ok(BODY_TENSION_DRILLS.some((d) => d.id === `bt-${id}`)),
    ),
  );
});
