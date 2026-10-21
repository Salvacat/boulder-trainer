import { BODY_TENSION_SESSION, BODY_TENSION_DRILLS } from "./bodyTension.js";
import { DEFAULT_CONFIG } from "../utils/workoutTimer.js";

import { COACHING_SESSIONS } from "./coachingPathway.js";

export const TRAINING_SESSIONS = [
  {
    id: "body-tension",
    title: "Body tension & hooks",
    category: "Technique",
    level: "Intermediate",
    minutes: 120,
    description:
      "Connect hands and feet. Explore heel hooks, toe hooks and body tension.",
    drillIds: BODY_TENSION_DRILLS.map((d) => d.id),
    blocks: BODY_TENSION_SESSION.blocks.map((b) => ({
      title: b.title,
      minutes: b.minutes,
      suggested: b.suggested,
    })),
  },
  {
    id: "footwork-balance",
    title: "Footwork & balance",
    category: "Foundations",
    level: "All levels",
    minutes: 45,
    description: "Quiet feet, stable hips and deliberate movement.",
    drillIds: ["d1", "d2", "d3", "d5"],
    blocks: [
      { title: "Silent feet", minutes: 10 },
      { title: "Sticky feet", minutes: 10 },
      { title: "Hover hand", minutes: 10 },
      { title: "Center of gravity", minutes: 15 },
    ],
  },
  {
    id: "overhang-movement",
    title: "Move better on steep walls",
    category: "Technique",
    level: "Intermediate",
    minutes: 45,
    description: "Turn the hips, use the legs and find a stable flag.",
    drillIds: ["d4", "d10", "d11", "d12"],
    blocks: [
      { title: "Straight arms", minutes: 10 },
      { title: "Twist-lock traverse", minutes: 10 },
      { title: "Flag & tap", minutes: 10 },
      { title: "No matching", minutes: 15 },
    ],
  },
  ...COACHING_SESSIONS,
];

export function sessionTimerConfig(session) {
  return {
    ...DEFAULT_CONFIG,
    mode: "mix",
    intro: 10,
    blocks: session.blocks.map((b, i) => ({
      ...DEFAULT_CONFIG,
      mode: "work",
      id: `${session.id}-${i}`,
      label: b.title,
      duration: b.minutes * 60,
      intro: 0,
    })),
  };
}

export function appendSessionItems(current, drills) {
  const existing = new Set(current.map((d) => d.id));
  return [
    ...current,
    ...drills
      .filter((d) => !existing.has(d.id))
      .map((d) => ({ ...d, type: "drill", completed: false })),
  ];
}
