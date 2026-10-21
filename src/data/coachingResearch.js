import { ADVANCED_VIDEOS, ADVANCED_RESOURCES } from "./advancedTraining.js";

// Public creator descriptions and chapter metadata checked 21 October 2026.
// These are related demonstrations, not claims that the videos prescribe our drills.
export const RESEARCH_DATE = "2026-10-21";
export const VIDEOS = {
  ...ADVANCED_VIDEOS,
  feet: {
    title: "Climbing Techniques for Effective Footwork",
    channel: "Lattice Training",
    id: "8ZAdKNgdYm8",
    note: "Edging, smearing, foot swaps, flagging and heel hooks.",
  },
  drills: {
    title: "How to Train Footwork for Climbing",
    channel: "Send Edition",
    id: "VOn8WtjI3hQ",
    note: "A collection of footwork drills; chapters include quiet feet, coins and tennis-ball hands.",
  },
  tension: {
    title: "The Reason You Can't Hold Body Tension",
    channel: "Movement for Climbers",
    id: "MfOMBr4wB30",
    note: "Leverage and pressure, rather than simply bracing the abdominals.",
  },
  toe: {
    title: "Fix Your Toe Hooks: 5 Essential Tips",
    channel: "Lattice Training",
    id: "nANlqVWUgcM",
    note: "Active toe hooks, shin engagement and counter-pressure.",
  },
  movement: {
    title: "7 Key Techniques to Master in Climbing",
    channel: "Movement for Climbers",
    id: "2LEnGELJxw0",
    note: "Movement vocabulary: swaps, flags, deadpoints, smears, hip rotation and crossovers.",
  },
  grip: {
    title: "A Deep Dive into EVERY Climbing Grip Type",
    channel: "Lattice Training",
    id: "HBa-ilEp4Os",
    note: "Compare grip choices; no grip position guarantees protection from injury.",
  },
  reading: {
    title: "How to route read a climb or boulder",
    channel: "The Boardroom Climbing Ltd",
    id: "0GlESnNeAIU",
    note: "Plan a possible sequence before leaving the ground.",
  },
  deadpoint: {
    title: "Movement Skills for Climbers | Deadpoint Practice",
    channel: "Power Company Climbing",
    id: "lfHdjPd4O1M",
    note: "Explore reach, leg drive, timing and a controlled catch.",
  },
  rest: {
    title: "Climbing Movement: 18. Resting While Climbing",
    channel: "Climbing Tech Tips",
    id: "H1PFWGf_1Ik",
    note: "Look for positions that let you recover and review the next move.",
  },
  fall: {
    title: "How to Fall 101 | Indoor Bouldering Safety",
    channel: "Wall Walkers",
    id: "JcmE8CdKZtE",
    note: "Landing awareness, downclimbing and coached falling practice.",
  },
  mantle: {
    title: "Essentials of Climbing: Mantles",
    channel: "Eastern Mountain Sports / Joe Kinder",
    id: "j72cRYeQaoM",
    note: "Demonstration of the transition from pulling to pressing.",
  },
  repeat: {
    title: "Movement Skills for Climbers | Perfect Repeat",
    channel: "Power Company Climbing",
    id: "UeHg5F5OJIw",
    note: "Refine movement choices; good execution can be fast or slow.",
  },
};
export const youtubeUrl = (key, seconds = 0) =>
  `https://www.youtube.com/watch?v=${VIDEOS[key].id}${seconds ? `&t=${seconds}s` : ""}`;

// [resource, chapter seconds, what the trainer should look for, relationship]
export const DRILL_RESOURCES = {
  ...ADVANCED_RESOURCES,
  d1: [
    "drills",
    23,
    "Watch the shoe all the way to contact.",
    "Drill demonstration",
  ],
  d2: [
    "feet",
    17,
    "Compare an accurate first placement with repeated adjustment.",
    "Related technique",
  ],
  d3: [
    "tension",
    60,
    "Find a stance that permits a brief hand release.",
    "Related principle",
  ],
  d4: [
    "movement",
    470,
    "Use leg drive and hip position without forcing the elbows to lock.",
    "Related technique",
  ],
  d5: [
    "tension",
    60,
    "Observe how the support points affect balance; the prop is optional.",
    "Related principle; prop is an app exercise",
  ],
  d6: [
    "drills",
    95,
    "Transfer weight onto a foot before rising.",
    "Drill demonstration",
  ],
  d7: [
    "feet",
    600,
    "Leave room for the incoming toe.",
    "Technique demonstration",
  ],
  d8: [
    "reading",
    0,
    "Ask the partner to predict feet as well as hands.",
    "Related technique",
  ],
  d10: [
    "movement",
    470,
    "Compare a hip turn with a frontal move on the same holds.",
    "Technique demonstration",
  ],
  d11: [
    "feet",
    816,
    "Find a flag direction that reduces unwanted rotation.",
    "Technique demonstration",
  ],
  d12: [
    "movement",
    552,
    "Explore crossing without assuming it is always the best solution.",
    "Related technique",
  ],
  d13: [
    "drills",
    267,
    "Use an agreed target to make placement visible.",
    "Drill demonstration",
  ],
  d14: [
    "grip",
    312,
    "Choose a manageable hold and compare grip positions.",
    "Technique explanation",
  ],
  d15: [
    "drills",
    427,
    "Reduce reliance on the hands and observe foot loading.",
    "Drill demonstration",
  ],
  d16: [
    "reading",
    0,
    "Recall a short sequence, climb with eyes open, then compare.",
    "Related technique",
  ],
  d17: [
    "deadpoint",
    0,
    "Observe the timing of leg drive and the catch.",
    "Related technique; tap variation is an app exercise",
  ],
  d18: [
    "deadpoint",
    0,
    "Look for whole-body timing instead of an arm-only pull.",
    "Related technique",
  ],
  d19: [
    "rest",
    0,
    "Ask whether the stance actually reduces effort.",
    "Technique demonstration",
  ],
  d20: [
    "drills",
    179,
    "Look down to select the next foothold.",
    "Drill demonstration",
  ],
  d21: [
    "fall",
    0,
    "Rehearse only the progression agreed with the gym instructor.",
    "Safety demonstration",
  ],
  d22: [
    "fall",
    0,
    "Check the landing and retain the option to downclimb.",
    "Related safety context; breathing drill is an app exercise",
  ],
  "bt-wall": [
    "tension",
    60,
    "Compare contact pressure before and after a small hip shift.",
    "Related principle",
  ],
  "bt-opposite": [
    "tension",
    82,
    "Explore the diagonal hand-to-foot connection.",
    "Related principle",
  ],
  "bt-hover": [
    "tension",
    193,
    "Maintain useful foot pressure as one hand releases.",
    "Related principle",
  ],
  "bt-no-cut": [
    "tension",
    247,
    "Watch the feet throughout the reach.",
    "Related principle",
  ],
  "bt-three-point": [
    "tension",
    193,
    "Name the three contacts and their directions of force.",
    "Related principle",
  ],
  "bt-cut": [
    "tension",
    247,
    "Compare effort with and without contact; a foot cut is sometimes useful.",
    "Related principle",
  ],
  "bt-active-heel": [
    "feet",
    1069,
    "Compare placing the heel with actively using it.",
    "Technique demonstration",
  ],
  "bt-heel-unload": [
    "feet",
    1069,
    "Check whether the hook permits lighter hands.",
    "Related technique",
  ],
  "bt-heel-angle": [
    "feet",
    1069,
    "Change placement gradually within a comfortable range.",
    "Related technique",
  ],
  "bt-rock-over": [
    "mantle",
    0,
    "Observe the transition from pulling to standing.",
    "Related technique",
  ],
  "bt-toe-stability": [
    "toe",
    0,
    "Keep the toe active rather than resting it on the hold.",
    "Technique demonstration",
  ],
  "bt-toe-release": [
    "toe",
    0,
    "Establish counter-pressure before reducing hand support.",
    "Related technique",
  ],
  "bt-toe-resist": [
    "toe",
    0,
    "Use the hook to resist rotation; external resistance is optional.",
    "Related principle; partner variation is an app exercise",
  ],
  "bt-compare": [
    "feet",
    1069,
    "Compare the task each hook solves.",
    "Related technique",
  ],
  "bt-transition": [
    "toe",
    0,
    "Plan how to unload one hook before changing it.",
    "Related technique",
  ],
  "bt-finish": [
    "repeat",
    0,
    "Select one movement goal and review it after the attempt.",
    "Related practice approach",
  ],
  "rx-smear": [
    "feet",
    368,
    "Notice how the foot stays loaded during the weight shift.",
    "Technique demonstration",
  ],
  "rx-cross": [
    "movement",
    552,
    "Make room for the crossing arm through foot and hip choices.",
    "Technique demonstration",
  ],
  "rx-sloper": [
    "grip",
    0,
    "Compare positions with the same hold rather than squeezing harder.",
    "Related technique",
  ],
  "rx-mantle": [
    "mantle",
    0,
    "Move weight over the supporting foot before standing.",
    "Technique demonstration",
  ],
  "rx-deadpoint": [
    "deadpoint",
    0,
    "Change one variable between attempts.",
    "Practice demonstration",
  ],
  "rx-repeat": [
    "repeat",
    0,
    "Choose the movement quality to improve before repeating.",
    "Practice demonstration",
  ],
  "rx-beta": [
    "reading",
    0,
    "Treat the first plan as a hypothesis, then revise it.",
    "Related technique",
  ],
  "rx-transfer": [
    "repeat",
    0,
    "Check the skill on a new problem without prompting.",
    "Related practice approach; transfer task is an app exercise",
  ],
};

export const COACHING_SOURCES = [
  {
    title: "Foundation Coach handbook",
    publisher: "Mountain Training",
    url: "https://www.mountain-training.org/media/g0zntoz4/foundation-coach-candidate-handbook.pdf",
    use: "Reflective coaching and varied practice.",
  },
  {
    title: "Development Coach handbook",
    publisher: "Mountain Training",
    url: "https://www.mountain-training.org/media/flxjepna/development-coach-candidate-handbook.pdf",
    use: "Adapt practice and feedback to the individual learner.",
  },
  {
    title: "Bouldering: session delivery and supervision",
    publisher: "Mountain Training",
    url: "https://www.mountain-training.org/media/sv4hbbvm/bouldering_guidance_on_session_delivery_and_supervision.pdf",
    use: "Choose games and drills for a clear learning outcome.",
  },
  {
    title: "Get to grips with route reading",
    publisher: "British Mountaineering Council",
    url: "https://www.thebmc.co.uk/en/get-to-grips-with-route-reading",
    use: "Predict, test and revise a sequence that suits the climber.",
  },
  {
    title: "Struggling with BIG moves?",
    publisher: "Lattice Training",
    url: "https://www.latticetraining.com/blog/struggling-with-big-moves",
    use: "Connect movement practice with regular reassessment and feedback.",
  },
];
