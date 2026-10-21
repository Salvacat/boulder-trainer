import { test } from "node:test";
import assert from "node:assert/strict";
import {
  selectTimerCues,
  CUE_PATTERNS,
  cueMode,
} from "../src/utils/timerCues.js";
import {
  TRAINING_SESSIONS,
  sessionTimerConfig,
  appendSessionItems,
} from "../src/data/sessions.js";
import { buildPhases } from "../src/utils/workoutTimer.js";
const snapshot = (values) => ({
  id: "workout",
  index: 0,
  status: "running",
  kind: "work",
  elapsed: 0,
  remaining: 20,
  duration: 20,
  countedRounds: 0,
  deathRound: null,
  ...values,
});

test("prepare counts 3, 2, 1 once each and speaks work at the boundary", () => {
  let before = snapshot({ kind: "prepare", status: "ready", remaining: 3 });
  let now = snapshot({ kind: "prepare", remaining: 3 });
  assert.deepEqual(selectTimerCues(before, now), [
    { type: "countdown", words: "3" },
  ]);
  before = now;
  now = snapshot({ kind: "prepare", remaining: 2 });
  assert.equal(selectTimerCues(before, now)[0].words, "2");
  assert.deepEqual(selectTimerCues(now, now), []);
  before = now;
  now = snapshot({ kind: "prepare", remaining: 1 });
  assert.equal(selectTimerCues(before, now)[0].words, "1");
  assert.deepEqual(selectTimerCues(now, snapshot({ index: 1 })), [
    { type: "work", words: "Work" },
  ]);
});
test("round completion and recovery are separate cues; next work has its own cue", () => {
  assert.deepEqual(
    selectTimerCues(snapshot(), snapshot({ index: 1, kind: "rest" })).map(
      (x) => x.type,
    ),
    ["repEnd", "rest"],
  );
  assert.deepEqual(
    selectTimerCues(
      snapshot({ index: 1, kind: "rest" }),
      snapshot({ index: 2, round: 2 }),
    ).map((x) => x.type),
    ["work"],
  );
  assert.deepEqual(
    selectTimerCues(snapshot(), snapshot({ status: "complete" })),
    [{ type: "complete", words: "Workout complete" }],
  );
});
test("work, rest, rep end and finish use four distinct pitch/rhythm patterns", () => {
  assert.equal(
    new Set(
      ["work", "rest", "repEnd", "complete"].map((k) =>
        JSON.stringify(CUE_PATTERNS[k]),
      ),
    ).size,
    4,
  );
  assert.ok(CUE_PATTERNS.work[0][0] < CUE_PATTERNS.work[1][0]);
  assert.ok(CUE_PATTERNS.rest[0][0] > CUE_PATTERNS.rest[1][0]);
});
test("pause, repeat renders and new setups are silent; resume announces current phase", () => {
  const n = snapshot();
  assert.deepEqual(selectTimerCues(n, n), []);
  assert.deepEqual(selectTimerCues(n, snapshot({ status: "paused" })), []);
  assert.deepEqual(selectTimerCues(n, snapshot({ id: "new" })), []);
  assert.equal(
    selectTimerCues(
      snapshot({ status: "paused", kind: "rest" }),
      snapshot({ kind: "rest" }),
    )[0].words,
    "Resume. Rest",
  );
});
test("background catch-up announces current phase without replaying missed rounds", () => {
  assert.deepEqual(
    selectTimerCues(snapshot(), snapshot({ index: 6 })).map((x) => x.type),
    ["work"],
  );
  assert.deepEqual(
    selectTimerCues(snapshot(), snapshot({ remaining: 2 }), {
      countdown: false,
    }),
    [],
  );
  assert.equal(
    selectTimerCues(snapshot(), snapshot({ countedRounds: 1 }))[0].type,
    "repEnd",
  );
});
test("legacy voice/mute preferences map to clear cue choices", () => {
  assert.equal(cueMode({ sound: "Chime", voice: true }), "both");
  assert.equal(cueMode({ sound: "Off", voice: true }), "voice");
  assert.equal(cueMode({ sound: "Chime", voice: false }), "sounds");
  assert.equal(cueMode({ sound: "Off", voice: false }), "off");
});
test("selectable session timers retain the body program and do not duplicate plan items", () => {
  const body = TRAINING_SESSIONS.find((x) => x.id === "body-tension");
  assert.equal(body.drillIds.length, 16);
  assert.equal(
    buildPhases(sessionTimerConfig(body)).reduce(
      (sum, p) => sum + p.duration,
      0,
    ),
    7210,
  );
  for (const s of TRAINING_SESSIONS)
    assert.equal(
      s.blocks.reduce((sum, b) => sum + b.minutes, 0),
      s.minutes,
    );
  const existing = [{ id: "d1", completed: true }];
  assert.deepEqual(
    appendSessionItems(existing, [
      { id: "d1" },
      { id: "d2", title: "Sticky feet" },
    ]),
    [
      ...existing,
      { id: "d2", title: "Sticky feet", type: "drill", completed: false },
    ],
  );
});
