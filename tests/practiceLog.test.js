import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanPracticeEntries,
  mergePracticeEntries,
  localDate,
  trainerBackup,
} from "../src/utils/practiceLog.js";
import {
  MOVEMENT_TOPICS,
  ADVANCED_SOURCES,
  ADVANCED_DRILLS,
} from "../src/data/advancedTraining.js";
import { INITIAL_DATABASE } from "../src/data/initialData.js";
import { COACHING_SESSIONS } from "../src/data/coachingPathway.js";
import { VIDEOS } from "../src/data/coachingResearch.js";
import { findTopics } from "../src/utils/topicSearch.js";

test("topic search handles feet/foot, multiple words and category boundaries", () => {
  assert.ok(
    findTopics(MOVEMENT_TOPICS, "feet cut?").some((t) => t.id === "opposition"),
  );
  assert.ok(
    findTopics(MOVEMENT_TOPICS, "slab balance").some(
      (t) => t.id === "friction",
    ),
  );
  assert.ok(
    findTopics(MOVEMENT_TOPICS, "projecting", "Tactics").some(
      (t) => t.id === "projecting",
    ),
  );
  assert.equal(findTopics(MOVEMENT_TOPICS, "projecting", "Contact").length, 0);
});

test("movement studies connect valid gym anchors, drills, lessons and explicit source limits", () => {
  const drillIds = new Set(INITIAL_DATABASE.drills.map((d) => d.id));
  assert.equal(MOVEMENT_TOPICS.length, 8);
  assert.equal(ADVANCED_DRILLS.length, 16);
  for (const topic of MOVEMENT_TOPICS) {
    assert.ok(INITIAL_DATABASE.courses.some((c) => c.id === topic.courseId));
    assert.ok(COACHING_SESSIONS.some((s) => s.id === topic.sessionId));
    topic.drillIds.forEach((id) =>
      assert.ok(drillIds.has(id), `${topic.id} references missing drill ${id}`),
    );
    topic.sourceIds.forEach((id) => {
      const s = ADVANCED_SOURCES[id];
      assert.ok(s?.finding && s?.limit);
      assert.match(s.url, /^https:\/\//);
    });
    topic.videoKeys.forEach((key) => assert.ok(VIDEOS[key]));
    assert.equal(topic.progression.length, 3);
    assert.ok(topic.diagnoses.every((d) => d.length === 3));
  }
});
const record = {
  id: "test-1",
  topicId: "opposition",
  date: "2026-10-21",
  who: "AB",
  role: "coach",
  status: "revisit",
  observation: "Foot releases before the reach.",
  experiment: "Compare a second foot position.",
  result: "Less rotation.",
  next: "Try a new layout next session.",
};

test("practice backups retain observations and follow-up while rejecting malformed records", () => {
  const clean = cleanPracticeEntries([
    record,
    { ...record, id: "bad-date", date: "2026-02-30" },
    { ...record, id: 7 },
    { ...record, id: "empty", observation: "   " },
    null,
    record,
  ]);
  assert.equal(clean.length, 1);
  assert.equal(clean[0].next, record.next);
  assert.equal(clean[0].status, "revisit");
  assert.deepEqual(cleanPracticeEntries({ notes: [record] }), []);
  const limited = cleanPracticeEntries([
    { ...record, observation: "x".repeat(4000), status: "bogus" },
  ])[0];
  assert.equal(limited.observation.length, 3000);
  assert.equal(limited.status, "tested");
});

test("import adds missing notes without duplicates or overwriting local edits", () => {
  const edited = { ...record, result: "Local edited result" };
  const merged = mergePracticeEntries(
    [edited],
    [record, { ...record, id: "test-2", who: "Me" }],
  );
  assert.equal(merged.length, 2);
  assert.equal(merged[0].result, "Local edited result");
  assert.equal(mergePracticeEntries(merged, merged).length, 2);
  assert.equal(localDate(new Date(2026, 9, 21, 0, 15)), "2026-10-21");
});

test("personal backup JSON round-trip includes practice history and keeps existing trainer fields", () => {
  const backup = JSON.parse(
    JSON.stringify(
      trainerBackup({
        customDrills: [],
        students: [{ id: "student-example" }],
        favorites: ["d1"],
        savedTemplates: [],
        practiceEntries: [record],
      }),
    ),
  );
  assert.equal(backup.version, "1.1");
  assert.equal(backup.students[0].id, "student-example");
  assert.deepEqual(backup.favorites, ["d1"]);
  const restored = mergePracticeEntries([], backup.practiceEntries);
  assert.equal(restored.length, 1);
  assert.equal(restored[0].result, record.result);
  assert.equal(restored[0].next, record.next);
});
