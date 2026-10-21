import test from "node:test";
import assert from "node:assert/strict";
import { INITIAL_DATABASE } from "../src/data/initialData.js";
import {
  COACHING_LEVELS,
  COACHING_SESSIONS,
} from "../src/data/coachingPathway.js";
import {
  DRILL_RESOURCES,
  VIDEOS,
  youtubeUrl,
} from "../src/data/coachingResearch.js";
import { TRAINING_SESSIONS, sessionTimerConfig } from "../src/data/sessions.js";
import { buildPhases } from "../src/utils/workoutTimer.js";
import {
  boundedNumber,
  timeParts,
  fromTimeParts,
} from "../src/utils/numberPicker.js";

test("every built-in drill has a direct YouTube reference and an observation goal", () => {
  const ids = INITIAL_DATABASE.drills.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 61);
  for (const id of ids) {
    const [key, seconds, focus, relation] = DRILL_RESOURCES[id] || [];
    assert.ok(VIDEOS[key], `${id} needs a researched video`);
    assert.match(
      youtubeUrl(key, seconds),
      /^https:\/\/www.youtube.com\/watch\?v=[\w-]{11}(&t=\d+s)?$/,
    );
    assert.ok(
      focus && relation,
      `${id} needs context rather than an unexplained link`,
    );
  }
  assert.deepEqual(Object.keys(DRILL_RESOURCES).sort(), ids.sort());
});

test("trainer lessons retain links to gym courses, valid drills and usable session timers", () => {
  assert.equal(INITIAL_DATABASE.courses.length, 3);
  assert.equal(INITIAL_DATABASE.courses[0].days.length, 4);
  assert.equal(COACHING_LEVELS.length, 9);
  assert.equal(COACHING_SESSIONS.length, 18);
  const ids = new Set(INITIAL_DATABASE.drills.map((d) => d.id));
  for (const level of COACHING_LEVELS) {
    assert.ok(INITIAL_DATABASE.courses.some((c) => c.id === level.courseId));
    for (const lesson of level.lessons) {
      assert.ok(
        lesson.observe && lesson.easier && lesson.harder && lesson.review,
      );
      lesson.drillIds.forEach((id) =>
        assert.ok(ids.has(id), `${lesson.id}: missing ${id}`),
      );
    }
  }
  for (const session of COACHING_SESSIONS) {
    assert.ok(TRAINING_SESSIONS.some((s) => s.id === session.id));
    assert.equal(
      session.blocks.reduce((sum, b) => sum + b.minutes, 0),
      session.minutes,
    );
    const phases = buildPhases(sessionTimerConfig(session));
    assert.equal(
      phases
        .filter((p) => p.kind !== "prepare")
        .reduce((sum, p) => sum + p.duration, 0),
      3600,
    );
  }
});

test("picker preserves arbitrary seconds, zero settings and timer bounds", () => {
  for (const n of [0, 1, 59, 60, 75, 3599, 3600, 3661, 86400])
    assert.equal(fromTimeParts(timeParts(n), 0, 86400), n);
  assert.equal(fromTimeParts([24, 59, 59], 0, 86400), 86400);
  assert.equal(fromTimeParts([0, 0, 0], 1, 86400), 1);
  assert.equal(boundedNumber("", 0, 60), 0);
  assert.equal(boundedNumber("", 1, 100), 1);
  assert.equal(boundedNumber(200, 1, 100), 100);
});
