// Research-informed trainer adaptations. Protocols and success checks are app-authored.
export const ADVANCED_SOURCES = {
  opposition: {
    title: "Opposition vs. Compression",
    author: "Climbing Tech Tips",
    url: "https://climbingtechtips.vhx.tv/videos/climbing-movement-opposition-vs-compression",
    type: "Creator explanation",
    finding:
      "Contrasting directions of contact can stabilise a position; a bicycle combines pushing and hooking.",
    limit:
      "A technique explanation, not evidence that one drill improves a particular grade.",
  },
  rotation: {
    title: "7 Key Techniques to Master in Climbing",
    author: "Movement for Climbers",
    url: "https://www.youtube.com/watch?v=2LEnGELJxw0",
    type: "Video description and chapters",
    finding:
      "Hip rotation, crossing and flags offer different movement options.",
    limit:
      "Options depend on the move and the climber; no single hip position is universally efficient.",
  },
  drop: {
    title: "Drop-knee technique",
    author: "Movement for Climbers",
    url: "https://www.youtube.com/watch?v=U0v9xxqEjfY",
    type: "Video description",
    finding: "A reference for recognising the drop-knee movement pattern.",
    limit:
      "Our entry-and-exit task is an adaptation. Do not force knee rotation or assume a deeper drop is better.",
  },
  slab: {
    title: "4 Lessons to Master Slab Climbing Like Anna Hazelnutt",
    author: "Lattice Training",
    url: "https://www.youtube.com/watch?v=wUHEnXoWblo",
    type: "Video description",
    finding:
      "High steps and directional pulling are useful aspects of the illustrated slab style.",
    limit:
      "An athlete example is not a template for every body. Our tasks do not prescribe maximal crimping.",
  },
  momentum: {
    title: "Climb Harder With These Momentum Drills!",
    author: "Lattice Training",
    url: "https://www.youtube.com/watch?v=K-dTaYG-C1M",
    type: "Video description",
    finding:
      "Momentum can be subtle or explosive, with different timing and coordination demands.",
    limit:
      "Our low-move progressions are adaptations; a larger jump is not the measure of learning.",
  },
  holds: {
    title: "Side Pulls",
    author: "Climbing Tech Tips",
    url: "https://climbingtechtips.vhx.tv/videos/climbing-movement-side-pulls-1",
    type: "Creator explanation",
    finding:
      "Foot and body position help create a useful lateral pull; gastons are one orientation.",
    limit:
      "Use comfortable positions and suitable holds; this is movement coaching, not shoulder rehabilitation.",
  },
  grips: {
    title: "A Deep Dive into EVERY Climbing Grip Type",
    author: "Lattice Training",
    url: "https://www.youtube.com/watch?v=HBa-ilEp4Os",
    type: "Video description and chapters",
    finding: "Grip choice changes with hold geometry and the movement task.",
    limit:
      "No grip is injury-proof; this atlas is not a finger-strength prescription.",
  },
  projecting: {
    title: "Top 10 Projecting Strategies",
    author: "Lattice Training / Tom Randall",
    url: "https://latticetraining.com/blog/bouldering-top-10-projecting-strategies-for-beginners-and-intermediate-climbers",
    type: "Coaching article",
    finding:
      "Projecting includes testing beta, rehearsing unusual positions and starting within the problem.",
    limit:
      "Our overlap and finish-link tasks are adaptations; outdoor access methods are not part of these gym drills.",
  },
  rhythm: {
    title: "Kris Hampton: 6 Movement Drills",
    author: "TrainingBeta interview with Power Company Climbing",
    url: "https://www.trainingbeta.com/media/kris-movement/",
    type: "Coach interview transcript",
    finding:
      "Pace, rhythm and tension are distinct practice themes. Slow movement is not always the useful choice.",
    limit:
      "An experienced coach’s account, not a controlled comparison of drill effectiveness.",
  },
  variability: {
    title: "Climbing technique with the Constraints-Led Approach",
    author: "Lattice Training",
    url: "https://www.latticetraining.com/blog/improve-your-climbing-technique-with-the-constraint-led-approach-cla",
    type: "Coaching article",
    finding:
      "Changing task constraints can invite different solutions and adaptive practice.",
    limit:
      "The article advocates one approach. It does not establish that repetition or explicit instruction is always inferior.",
  },
  transfer: {
    title: "Affordance Realization in Climbing: Learning and Transfer",
    author: "Seifert and colleagues, 2018",
    url: "https://pubmed.ncbi.nlm.nih.gov/29892251/",
    type: "Primary study · abstract",
    finding:
      "Manipulated hold orientations were used to investigate exploration and transfer in intermediate climbers.",
    limit:
      "A specific research task; it does not validate our lesson sequence or prove transfer to elite performance.",
  },
  pilot: {
    title:
      "Development of Specific Motor Skills through System Wall Bouldering Training",
    author: "Stien and colleagues, 2024",
    url: "https://onlinelibrary.wiley.com/doi/10.1155/2024/5584962",
    type: "Primary pilot study · full text",
    finding:
      "Thirteen advanced female boulderers practised for five weeks. Both groups showed some improvement, with no significant between-group difference.",
    limit:
      "Small, specific sample and short intervention. Structured system-wall work was not shown superior to conventional bouldering.",
  },
};

export const ADVANCED_VIDEOS = {
  opposition: {
    title: "Climbing Movement: 16. Opposition vs. Compression",
    channel: "Climbing Tech Tips",
    id: "ar06kKAHmuA",
    note: "Opposing contacts, compression and bicycle technique.",
  },
  momentum: {
    title: "Climb Harder With These Momentum Drills!",
    channel: "Lattice Training",
    id: "K-dTaYG-C1M",
    note: "Subtle and explosive momentum; related reference for our timing tasks.",
  },
  drop: {
    title: "Drop-knee technique",
    channel: "Movement for Climbers",
    id: "U0v9xxqEjfY",
    note: "Related demonstration for our rotation and exit experiments.",
  },
  slab: {
    title: "4 Lessons to Master Slab Climbing Like Anna Hazelnutt",
    channel: "Lattice Training",
    id: "wUHEnXoWblo",
    note: "Athlete technique example; use the movement ideas without copying maximal loading.",
  },
  variability: {
    title: "Climbing technique and the Constraints-Led Approach",
    channel: "Lattice Training",
    id: "FvjEmQ6OcBg",
    note: "Practice design and variation; protocols in the atlas are our adaptations.",
  },
};

const drill = (id, title, focus, tags, setup, desc, execution, mistakes) => ({
  id,
  title,
  focus,
  tags,
  setup,
  desc,
  execution,
  mistakes,
  provenance: "Performance extension · trainer adaptation",
});
export const ADVANCED_DRILLS = [
  drill(
    "ax-bicycle",
    "Bicycle pressure switch",
    "Opposing foot contacts",
    ["#body-tension", "#toe-hook"],
    "Low steep section, two secure handholds and compatible opposing foot surfaces.",
    "Compare a single foot with a controlled push-and-hook pair.",
    [
      "Establish a comfortable toe hook and opposing pushing foot.",
      "Adjust one foot at a time while hands stay available.",
      "Compare unwanted rotation before and after the change.",
      "Unload each foot deliberately before stepping down.",
    ],
    [
      "Pulling harder without a useful opposing contact.",
      "Letting the hook snap free.",
    ],
  ),
  drill(
    "ax-reconnect",
    "Cut, settle, reconnect",
    "Managing an intentional foot cut",
    ["#body-tension", "#overhang"],
    "Very low overhang with large handholds and a clear landing; only for climbers comfortable with a controlled cut.",
    "Treat a foot cut as a movement option and practise the next contact.",
    [
      "Select an easy reach where a small cut is manageable.",
      "Compare keeping the feet with deliberately releasing them.",
      "Settle the small swing and reconnect to a visible foothold.",
      "Choose the option that best sets up the following move.",
    ],
    [
      "Making a large swing to create difficulty.",
      "Continuing when the shoulders or landing feel uncontrolled.",
    ],
  ),
  drill(
    "ax-backstep",
    "Backstep or flag?",
    "Rotation choices",
    ["#balance", "#overhang"],
    "Low traverse with positive feet and hands.",
    "Compare two ways of controlling rotation without changing the target.",
    [
      "Read a two-move section.",
      "Try a backstep using a comfortable outside edge.",
      "Rest and try a flag or frontal stance.",
      "Compare the exit as well as the reach.",
    ],
    [
      "Choosing the pose that looks best rather than the useful exit.",
      "Fixing the foot while forcing the knee to rotate.",
    ],
  ),
  drill(
    "ax-drop-exit",
    "Drop-knee entry & exit",
    "Reversible positioning",
    ["#balance", "#overhang"],
    "Low, easy terrain with good feet and no forced knee position.",
    "A useful drop knee must also permit a comfortable next movement.",
    [
      "Establish a shallow, comfortable turn with both hands available.",
      "Explore a small knee drop only within a pain-free range.",
      "Undo the position before adding a reach.",
      "Compare with a non-drop-knee solution.",
    ],
    [
      "Pursuing a deep knee drop as the objective.",
      "Adding force or persisting with discomfort.",
    ],
  ),
  drill(
    "ax-volume",
    "Volume contact map",
    "Friction & direction",
    ["#footwork", "#slab"],
    "Low volume approved for foot contact, reliable hands and an easy exit.",
    "Explore where and in which direction a volume can support the next move.",
    [
      "Name two possible foot contact areas.",
      "Load one gently, shift weight, and note what changes.",
      "Try the alternative without increasing reach.",
      "Use the more stable contact in a short sequence.",
    ],
    [
      "Assuming every part of a volume has the same friction.",
      "Turning this into a deliberate slip test.",
    ],
  ),
  drill(
    "ax-palm",
    "Palm & high-step balance",
    "Pressing and standing",
    ["#footwork", "#balance"],
    "Low slab or volume with a comfortable palm support and modest step height.",
    "Use a palm to manage balance while transferring onto a higher foot.",
    [
      "Find a comfortable palm support.",
      "Raise one foot to a manageable height.",
      "Move weight above it, then stand without rushing.",
      "Compare with a lower step and a different hand support.",
    ],
    [
      "Selecting a step beyond current comfortable mobility.",
      "Forcing the wrist or shoulder position.",
    ],
  ),
  drill(
    "ax-pogo",
    "Small momentum comparison",
    "Timing a free-leg swing",
    ["#dynamics"],
    "Low, positive holds and a short target; trainer confirms a controlled landing.",
    "Compare a small leg swing with a quieter leg-driven reach.",
    [
      "Start with a reachable target and secure support foot.",
      "Try the move with a small natural free-leg swing.",
      "Rest and repeat without that swing.",
      "Describe which timing helps the catch and next move.",
    ],
    [
      "Turning the task into maximum jump distance.",
      "Swinging the leg into the wall or other climbers.",
    ],
  ),
  drill(
    "ax-catch",
    "Catch, then choose",
    "Contact and redirection",
    ["#dynamics", "#tactics"],
    "Low dynamic move to a large target and an easy next hold.",
    "Practise what happens after contact instead of only touching the target.",
    [
      "Catch the target from a small controlled movement.",
      "Find the next support and continue to the easy hold.",
      "Compare stopping fully with continuing smoothly.",
      "Keep whichever version produces control for this sequence.",
    ],
    [
      "Calling a wild touch a successful catch.",
      "Insisting every dynamic contact must stop completely.",
    ],
  ),
  drill(
    "ax-undercling",
    "Undercling height experiment",
    "Hold direction & leg drive",
    ["#balance", "#grip-safety"],
    "Low positive undercling, large feet and comfortable shoulder positions.",
    "Test how foot height changes the usefulness of the same handhold.",
    [
      "Keep the undercling and other hand available.",
      "Compare two comfortable foothold heights.",
      "Notice when leg pressure helps the handhold feel useful.",
      "Try one short reach from the preferred stance.",
    ],
    [
      "Assuming higher feet are always better.",
      "Pulling maximally in an awkward position.",
    ],
  ),
  drill(
    "ax-gaston",
    "Sidepull-to-gaston options",
    "Lateral pulling and transitions",
    ["#balance", "#tactics"],
    "Low positive side-facing holds; choose orientations that are comfortable for the climber.",
    "Use foot and hip position to explore lateral hold directions.",
    [
      "Demonstrate a sidepull and a comfortable gaston orientation.",
      "Try each on suitable holds with both feet available.",
      "Move the feet before asking for a longer reach.",
      "Compare the next hand transition and select a solution.",
    ],
    [
      "Forcing an elbow angle to match someone else’s beta.",
      "Ignoring the feet while squeezing harder.",
    ],
  ),
  drill(
    "ax-overlap",
    "Overlapping links",
    "Projecting & transitions",
    ["#tactics"],
    "A project with individually manageable moves and safe mid-problem starts.",
    "Connect sections across their boundary, rather than rehearse isolated crux moves.",
    [
      "Choose two short sections with one shared move.",
      "Climb each section with full recovery between quality attempts.",
      "Link across the shared move.",
      "Record where the transition changes your body position.",
    ],
    [
      "Rehearsing only the easiest start.",
      "Adding attempts after quality clearly deteriorates.",
    ],
  ),
  drill(
    "ax-finishlink",
    "Build back from the finish",
    "Reliable finishing sequence",
    ["#tactics"],
    "A suitable project with an accessible low finishing section; follow gym access rules.",
    "Rehearse the exit before repeatedly spending effort on the start.",
    [
      "Practise a manageable final section from a permitted start.",
      "Add one earlier move when the finish is repeatable.",
      "Rest and reassess the longer link.",
      "Keep the useful sequence in the log before a full attempt.",
    ],
    [
      "Using unsafe access to a high finishing position.",
      "Treating a tired failure as evidence that the beta is wrong.",
    ],
  ),
  drill(
    "ax-pace",
    "Pace contrast",
    "Rhythm & effort",
    ["#tactics", "#resting"],
    "A familiar easy-to-moderate problem that can be repeated without rushing or exhaustion.",
    "Compare deliberate and continuous movement to choose where each helps.",
    [
      "Climb one short section with a deliberate pause at stable positions.",
      "Rest until ready for a comparable attempt.",
      "Repeat with a comfortable continuous rhythm.",
      "Choose where pausing or continuing helps; compare perceived effort.",
    ],
    [
      "Making “fast” mean uncontrolled.",
      "Assuming the slower attempt is automatically more technical.",
    ],
  ),
  drill(
    "ax-restmap",
    "Recovery position map",
    "Pacing a longer sequence",
    ["#resting", "#tactics"],
    "Easy longer traverse with room to stop without obstructing others.",
    "Find positions that actually reduce effort and plan what follows them.",
    [
      "Predict a useful pause point from the ground.",
      "Climb to it and compare two foot or hip positions.",
      "Check whether breathing and hand effort settle.",
      "Continue only after reading the next short section.",
    ],
    [
      "Stopping where maintaining the rest costs more effort.",
      "Using this as an all-out endurance test.",
    ],
  ),
  drill(
    "ax-variation",
    "Same goal, new constraints",
    "Adaptive movement",
    ["#tactics", "#balance"],
    "Two easy short problems with different hold orientations; use existing holds, do not move them.",
    "Keep the movement goal while allowing the solution to change.",
    [
      "Pick one goal such as controlling rotation.",
      "Explore a familiar problem with a simple constraint.",
      "Change to a different hold layout and remove the rule.",
      "Discuss which parts of the solution changed and why.",
    ],
    [
      "Changing difficulty, terrain and instructions all at once.",
      "Expecting the identical beta on a different problem.",
    ],
  ),
  drill(
    "ax-delay",
    "Return without the cue",
    "Retention & independence",
    ["#tactics"],
    "An easy practice task and a different problem to revisit later.",
    "Separate immediate improvement from learning that persists.",
    [
      "Agree one observation goal and practise briefly.",
      "Record the helpful cue and a next-session check.",
      "At the next visit, try a suitable task before repeating the cue.",
      "Compare independence and adaptation rather than awarding a mastery score.",
    ],
    [
      "Replaying instructions before checking recall.",
      "Interpreting one attempt as a permanent ability level.",
    ],
  ),
];

export const ADVANCED_RESOURCES = {
  "ax-bicycle": [
    "opposition",
    0,
    "Identify which foot pushes and which hooks.",
    "Related technique; app adaptation",
  ],
  "ax-reconnect": [
    "tension",
    247,
    "Compare the foot-contact choices and the next move.",
    "Related principle; app adaptation",
  ],
  "ax-backstep": [
    "movement",
    470,
    "Watch how a hip turn changes the exit.",
    "Related technique; app adaptation",
  ],
  "ax-drop-exit": [
    "drop",
    0,
    "Practise a comfortable entry and reversible exit.",
    "Related technique; app adaptation",
  ],
  "ax-volume": [
    "feet",
    368,
    "Notice the direction of loading on a smear.",
    "Related principle; app adaptation",
  ],
  "ax-palm": [
    "slab",
    0,
    "Compare a manageable high step and the support used.",
    "Related technique; app adaptation",
  ],
  "ax-pogo": [
    "momentum",
    0,
    "Compare subtle momentum with an unnecessary large swing.",
    "Related technique; app adaptation",
  ],
  "ax-catch": [
    "momentum",
    0,
    "Observe what happens after the hand makes contact.",
    "Related technique; app adaptation",
  ],
  "ax-undercling": [
    "grip",
    0,
    "Match the pulling direction to a comfortable stance.",
    "Related hold explanation; app adaptation",
  ],
  "ax-gaston": [
    "grip",
    0,
    "Compare hand orientation with the feet available.",
    "Related hold explanation; app adaptation",
  ],
  "ax-overlap": [
    "reading",
    0,
    "Plan the transition between sections.",
    "Related planning reference; app adaptation",
  ],
  "ax-finishlink": [
    "reading",
    0,
    "Rehearse the final sequence before a full attempt.",
    "Related planning reference; app adaptation",
  ],
  "ax-pace": [
    "repeat",
    0,
    "Choose a pace for the task rather than a visual style.",
    "Related practice reference; app adaptation",
  ],
  "ax-restmap": [
    "rest",
    0,
    "Check whether the selected position reduces effort.",
    "Related technique; app adaptation",
  ],
  "ax-variation": [
    "variability",
    415,
    "Change one task demand and let the solution adapt.",
    "Related practice design; app adaptation",
  ],
  "ax-delay": [
    "variability",
    0,
    "Revisit the task without prompting at a later session.",
    "Related learning context; app adaptation",
  ],
};

// Each topic opens one pane at a time. Deeper coach material stays out of the overview.
export const MOVEMENT_TOPICS = [
  {
    id: "opposition",
    title: "Control the swing",
    category: "Contact",
    summary: "Connect opposing contacts, then choose when to release them.",
    question: "What changes just before the foot cuts?",
    courseId: "c2",
    anchor: "Gym course 2 · hooks → performance extension",
    keywords: "tension compression bicycle foot cut swing steep toe heel",
    principles: [
      "A contact is useful because of the force it can apply in the current position. A toe hook, pushing foot or opposing hand can each resist a different movement.",
      "Keeping both feet is a practice constraint, not a universal rule. On harder problems, compare the cost of staying connected with a controlled cut and the quality of the next contact.",
    ],
    cue: "Make the foothold work against the handhold.",
    reflect: "Which contact helped you reach, and which stopped the swing?",
    coachCue: "Keep the hands; change one foot contact.",
    diagnoses: [
      [
        "Foot releases before the hand moves.",
        "Foot position or pressure may not support the chosen reach.",
        "Keep hands and target fixed; compare two foothold choices.",
      ],
      [
        "The move works, but the next foothold is missed.",
        "The catch may leave too much unwanted rotation.",
        "Shorten the reach and practise the catch-to-reconnect transition.",
      ],
    ],
    demo: "Show two short sequences: one where maintaining contact helps, and one where a small intentional cut creates a useful exit.",
    progression: [
      [
        "Explore",
        "On easy steep terrain, describe one pushing and one pulling contact.",
        "Can explain what each contact prevents.",
      ],
      [
        "Refine",
        "Compare a bicycle or changed foot position with the original beta.",
        "Can repeat the useful solution without a prompt.",
      ],
      [
        "Transfer",
        "Use a different steep problem with a choice of cut or keep.",
        "Selects a solution for the next move, not just for staying attached.",
      ],
    ],
    drillIds: ["ax-bicycle", "ax-reconnect", "bt-three-point"],
    sourceIds: ["opposition", "rotation"],
    videoKeys: ["opposition", "tension"],
    sessionId: "coach-l7-contact",
  },
  {
    id: "rotation",
    title: "Turn with an exit",
    category: "Contact",
    summary: "Flags, backsteps and drop knees are options, not poses to copy.",
    question: "Does the position help the next two moves?",
    courseId: "c2",
    anchor: "Gym course 2 · flagging & crossovers → performance extension",
    keywords: "drop knee backstep flag rotation hips crossover knee exit",
    principles: [
      "A hip turn changes reach and the direction of support. The same turn can help one move and trap the next.",
      "Practise entering and leaving a position, then compare an alternative. Let body proportions, footholds and comfort guide the solution instead of pursuing an exaggerated shape.",
    ],
    cue: "Turn enough to make the next move available.",
    reflect: "What did the move after the reach ask your feet to do?",
    coachCue: "Try both options and compare the exit.",
    diagnoses: [
      [
        "A reach improves but the climber gets stuck.",
        "The chosen rotation may close the next movement option.",
        "Include the following move in the comparison.",
      ],
      [
        "The climber forces a deep knee drop.",
        "They may be copying a shape rather than solving the task.",
        "Reduce the turn and test a flag or frontal stance.",
      ],
    ],
    demo: "Use the same low traverse to show a backstep, flag and frontal option; ask which one leaves a useful exit.",
    progression: [
      [
        "Explore",
        "Compare a flag and a backstep on one easy reach.",
        "Can describe how each changes balance.",
      ],
      [
        "Refine",
        "Enter and reverse a comfortable shallow drop knee.",
        "Can exit without forcing the knee.",
      ],
      [
        "Transfer",
        "Read a new three-move section with two possible solutions.",
        "Chooses and revises a position from its effect on the whole sequence.",
      ],
    ],
    drillIds: ["ax-backstep", "ax-drop-exit", "rx-cross"],
    sourceIds: ["rotation", "drop"],
    videoKeys: ["movement", "drop"],
    sessionId: "coach-l7-direction",
  },
  {
    id: "friction",
    title: "Stand on friction",
    category: "Movement",
    summary: "Find a useful pressure direction on slabs, volumes and presses.",
    question: "Where does the foot stop being loaded?",
    courseId: "c3",
    anchor: "Gym courses 2–3 · mantles & special techniques",
    keywords:
      "slab volume palm mantle high step friction smear rockover balance",
    principles: [
      "On friction features, ask where support comes from as weight moves. The right place to begin is not always the right place to stand.",
      "A higher step or closer chest is an option, not an instruction for every climber. Change contact area, stance or hand support before demanding more range or a longer reach.",
    ],
    cue: "Move onto the support before moving past it.",
    reflect: "Which change made the foot feel more dependable?",
    coachCue: "Keep the reach small; compare two support positions.",
    diagnoses: [
      [
        "A foot stays placed but slips as the hand reaches.",
        "The move may unload the support at the critical moment.",
        "Reduce reach and watch the weight shift across the foot.",
      ],
      [
        "A high step cannot be weighted.",
        "Balance, available support or comfortable range may limit this option.",
        "Try a lower step or different palm support before adding force.",
      ],
    ],
    demo: "Show a low high-step with and without a useful palm, then ask the climber to find a solution that suits their range.",
    progression: [
      [
        "Explore",
        "Map two comfortable contact areas on a low volume.",
        "Can move weight onto either without deliberate slipping.",
      ],
      [
        "Refine",
        "Link a palm support and a modest high step.",
        "Can stand and exit with control.",
      ],
      [
        "Transfer",
        "Try a new slab with a different support geometry.",
        "Adapts the contact and pulling direction rather than copying the same pose.",
      ],
    ],
    drillIds: ["ax-volume", "ax-palm", "rx-mantle"],
    sourceIds: ["slab", "rotation"],
    videoKeys: ["slab", "feet"],
    sessionId: "coach-l8-friction",
  },
  {
    id: "momentum",
    title: "Arrive ready to move",
    category: "Movement",
    summary: "Control launch, contact and what comes after the catch.",
    question: "Is the difficulty in launching, catching or leaving?",
    courseId: "c3",
    anchor: "Gym course 3 · jumps & coordination",
    keywords:
      "pogo dyno deadpoint coordination catch contact swing momentum timing",
    principles: [
      "A dynamic move includes the launch, contact and the next action. A dramatic touch is not the same as a useful catch.",
      "Small momentum changes can be practised on easy targets. Compare leg drive, a small free-leg swing and the timing of support before increasing distance. Sometimes continuing the movement is more useful than stopping it.",
    ],
    cue: "Catch in a position you can use.",
    reflect: "What happened immediately after you touched the target?",
    coachCue: "Change the timing before enlarging the move.",
    diagnoses: [
      [
        "The target is touched but not held.",
        "Arrival direction or timing may be unhelpful.",
        "Use a closer positive target and compare the approach.",
      ],
      [
        "Every attempt grows more explosive.",
        "The climber may be compensating for timing with force.",
        "Reduce the distance and compare smaller movement options.",
      ],
    ],
    demo: "Contrast a quiet deadpoint and a small leg-swing reach to the same positive target, then continue to an easy next hold.",
    progression: [
      [
        "Explore",
        "Reach a positive target using two manageable timing options.",
        "Can land or step down under control.",
      ],
      [
        "Refine",
        "Catch and continue through a short two-move sequence.",
        "Can repeat the intended contact-to-next-move link.",
      ],
      [
        "Transfer",
        "Change one target direction or foothold.",
        "Adjusts timing without automatically making the move larger.",
      ],
    ],
    drillIds: ["ax-pogo", "ax-catch", "rx-deadpoint"],
    sourceIds: ["momentum", "rotation"],
    videoKeys: ["momentum", "deadpoint"],
    sessionId: "coach-l8-momentum",
  },
  {
    id: "holds",
    title: "Read the pulling direction",
    category: "Contact",
    summary: "Make underclings, sidepulls and gastons useful through the feet.",
    question: "What direction is this hold inviting the climber to pull?",
    courseId: "c2",
    anchor: "Gym course 2 · advanced grips & gastons",
    keywords:
      "undercling gaston sidepull grip sloper directional thumb hand transition",
    principles: [
      "Hold shape alone does not describe the movement. Stance and direction determine how a handhold can be used.",
      "Keep the holds manageable while comparing foot height and hand orientation. A move feeling difficult does not by itself prove a strength deficit; equally, better beta does not remove every capacity limit.",
    ],
    cue: "Arrange the feet so the hand can pull usefully.",
    reflect: "What changed in the hand when you moved the feet?",
    coachCue: "Compare stance before asking for more hand effort.",
    diagnoses: [
      [
        "An undercling feels unusable at the start.",
        "The current stance may not oppose its direction.",
        "Compare two comfortable foot heights without a longer reach.",
      ],
      [
        "A gaston works only with a forced arm position.",
        "The stance or chosen orientation may not suit the climber.",
        "Change feet or test another beta; stop an uncomfortable version.",
      ],
    ],
    demo: "On low positive holds, contrast pulling straight down with a suitable lateral pull. Demonstrate alternatives rather than prescribing an elbow angle.",
    progression: [
      [
        "Explore",
        "Name the intended pull direction before leaving the ground.",
        "Can pair it with a plausible foot position.",
      ],
      [
        "Refine",
        "Compare two stances while keeping the same undercling or sidepull.",
        "Can repeat the comfortable option.",
      ],
      [
        "Transfer",
        "Read a new section with a hand-orientation change.",
        "Plans feet for the transition and revises the idea after testing.",
      ],
    ],
    drillIds: ["ax-undercling", "ax-gaston", "rx-sloper"],
    sourceIds: ["holds", "grips"],
    videoKeys: ["grip", "movement"],
    sessionId: "coach-l7-direction",
  },
  {
    id: "projecting",
    title: "Make attempts teach you",
    category: "Tactics",
    summary:
      "Build links, protect attempt quality and test a clear hypothesis.",
    question: "What will this attempt tell us?",
    courseId: "c3",
    anchor: "Gym courses 2–3 · projecting & weakness analysis",
    keywords:
      "project redpoint crux links beta tactics limit attempts plateau stronger grades",
    principles: [
      "A hard problem can fail at a transition even when each move works separately. Rehearse links that overlap the boundary and include the exit.",
      "Separate an observation from its explanation. A tired failure, a missed foothold and a fresh inability to hold a position suggest different next experiments. Plan recovery from readiness and quality rather than an arbitrary attempt count.",
    ],
    cue: "Give this attempt one job.",
    reflect: "What changed, and what evidence supports the next adjustment?",
    coachCue: "Record the event before naming the limiter.",
    diagnoses: [
      [
        "The crux works alone but fails from the start.",
        "The entry position or accumulated effort may change it.",
        "Rehearse a short overlap including the move before the crux.",
      ],
      [
        "Repeated attempts produce less useful information.",
        "Readiness or the experiment may have deteriorated.",
        "Recover, simplify the question, or end the block.",
      ],
    ],
    demo: "Choose two short sections with one shared move, show their transition, then explain the question for the next attempt.",
    progression: [
      [
        "Explore",
        "Name the specific event that ends the attempt.",
        "Observation stays separate from a strength or technique label.",
      ],
      [
        "Refine",
        "Build a reliable overlap and a finishing link.",
        "Can explain which transition improved.",
      ],
      [
        "Transfer",
        "Apply the same attempt-review routine on a new project.",
        "Selects useful experiments and recognises when to stop.",
      ],
    ],
    drillIds: ["ax-overlap", "ax-finishlink", "rx-beta"],
    sourceIds: ["projecting", "pilot"],
    videoKeys: ["reading", "repeat"],
    sessionId: "coach-l9-project",
  },
  {
    id: "pacing",
    title: "Spend effort where it helps",
    category: "Tactics",
    summary: "Use pace, pauses and recovery positions to support the sequence.",
    question: "Does slowing down save effort here, or add it?",
    courseId: "c2",
    anchor: "Gym course 2 · rests & tactics → performance extension",
    keywords:
      "pacing rhythm rest recovery endurance power endurance fatigue efficiency breathing",
    principles: [
      "Controlled movement can be slow or continuous. A pause that makes sense on a stable slab may cost unnecessary effort in a steep sequence.",
      "Compare pace on a familiar, repeatable task with adequate recovery. Track perceived effort and movement quality rather than turning the comparison into an exhaustion test.",
    ],
    cue: "Pause where you recover; keep moving where you do not.",
    reflect: "Which pause helped, and which one made the next move harder?",
    coachCue: "Compare the same short section at two comfortable paces.",
    diagnoses: [
      [
        "The climber pauses before every hard move.",
        "A useful preparation habit may have become an expensive delay.",
        "Compare a short continuous link with the usual sequence.",
      ],
      [
        "A shake-out does not seem to restore control.",
        "The stance may still demand too much effort.",
        "Try another foot or hip position and compare.",
      ],
    ],
    demo: "Contrast a stable pause with an effortful hanging pause, then compare a deliberate and continuous short section.",
    progression: [
      [
        "Explore",
        "Find a position that actually reduces effort.",
        "Can describe the difference between stopping and recovering.",
      ],
      [
        "Refine",
        "Choose where to pause in a longer manageable sequence.",
        "Can reproduce a purposeful rhythm.",
      ],
      [
        "Transfer",
        "Read pacing options on a new problem.",
        "Adapts pace to the task instead of following a fixed slow or fast rule.",
      ],
    ],
    drillIds: ["ax-pace", "ax-restmap", "d19"],
    sourceIds: ["rhythm", "projecting"],
    videoKeys: ["rest", "repeat"],
    sessionId: "coach-l9-project",
  },
  {
    id: "transfer",
    title: "Learn beyond the drill",
    category: "Learning",
    summary: "Check independent choices on new problems and later sessions.",
    question: "Does the improvement survive without the rule or cue?",
    courseId: "c3",
    anchor: "Gym course 3 · weakness analysis → coaching extension",
    keywords:
      "learning feedback retention transfer variability constraints assessment progression advanced coaching",
    principles: [
      "A drill can make a behaviour appear during practice without showing that it will persist. Remove the rule, try a different layout, and revisit later.",
      "Use both repetition and exploration for a purpose. Keep a task recognisable enough to compare attempts, then vary a demand that matters to the climber’s goal. Current research does not establish one universally best format for advanced climbers.",
    ],
    cue: "Keep the goal; find a solution for this problem.",
    reflect: "What did you use independently, and what needed a reminder?",
    coachCue: "Ask for the climber’s explanation before giving the next cue.",
    diagnoses: [
      [
        "The skill appears only while instructions are called.",
        "The practice may depend on external prompting.",
        "Remove the cue on an easy task and observe before intervening.",
      ],
      [
        "A familiar repeat is smooth but a new layout fails.",
        "The learned solution may be specific to that problem.",
        "Keep the goal and choose a comparable new layout.",
      ],
    ],
    demo: "Demonstrate a movement goal, let the climber choose a solution, then show how to test it on a different easy layout.",
    progression: [
      [
        "Explore",
        "Agree one observable goal and one practice task.",
        "Climber can describe what they are testing.",
      ],
      [
        "Refine",
        "Change one meaningful demand while reducing prompting.",
        "Can adapt the solution and explain the change.",
      ],
      [
        "Transfer",
        "Return next session before repeating the cue.",
        "Records what persists and selects the next task without a mastery score.",
      ],
    ],
    drillIds: ["ax-variation", "ax-delay", "rx-transfer"],
    sourceIds: ["variability", "transfer", "pilot"],
    videoKeys: ["variability", "repeat"],
    sessionId: "coach-l9-transfer",
  },
];

const lesson = (
  id,
  title,
  objective,
  drillIds,
  observe,
  easier,
  harder,
  review,
) => ({ id, title, objective, drillIds, observe, easier, harder, review });
export const ADVANCED_LEVELS = [
  {
    id: "level-7",
    number: 7,
    title: "Precise contacts & directional force",
    stage: "performance",
    courseId: "c3",
    anchor: "Gym course 3 · weakness analysis; course 2 movement vocabulary",
    entry:
      "Can repeat basic movement drills and describe a specific limitation on harder problems.",
    evidence:
      "Chooses and reproduces useful contact directions, then adapts them to another layout.",
    lessons: [
      lesson(
        "l7-contact",
        "Opposition under a reach",
        "Choose useful opposing contacts and manage a deliberate release.",
        ["ax-bicycle", "ax-reconnect", "bt-toe-stability"],
        "Compare foot pressure and the next contact across repeatable attempts.",
        "Less steep terrain, positive holds and shorter reaches.",
        "Different contact direction with the same movement goal.",
        "What was the foot preventing, and when was releasing it useful?",
      ),
      lesson(
        "l7-direction",
        "Direction before effort",
        "Compare stance and rotation choices before increasing hand effort.",
        ["ax-backstep", "ax-drop-exit", "ax-undercling", "ax-gaston"],
        "Include the exit move and the climber’s comfort in the comparison.",
        "One low move with both hands available.",
        "Read and test a new section with a hand-orientation change.",
        "Which option made both the reach and the exit more useful?",
      ),
    ],
  },
  {
    id: "level-8",
    number: 8,
    title: "Friction & linked coordination",
    stage: "performance",
    courseId: "c3",
    anchor: "Gym course 3 · special techniques, jumps & coordination",
    entry:
      "Trainer confirms readiness for the chosen terrain, comfortable support positions and controlled landings.",
    evidence:
      "Adapts pressure or timing across layouts while retaining useful control after contact.",
    lessons: [
      lesson(
        "l8-friction",
        "Volume and press solutions",
        "Find support directions that permit a comfortable stand and exit.",
        ["ax-volume", "ax-palm", "rx-mantle"],
        "Watch the support during the weight shift, not only the final position.",
        "Low features, smaller steps and more positive hands.",
        "A different volume shape with the same task.",
        "What changed in the support before the hand moved?",
      ),
      lesson(
        "l8-momentum",
        "Launch, catch, continue",
        "Coordinate a manageable dynamic link and compare what happens after contact.",
        ["ax-pogo", "ax-catch", "rx-deadpoint"],
        "Separate launch difficulty, contact quality and the next move.",
        "Closer positive targets and deliberate recovery between attempts.",
        "Change one direction or foothold while preserving a controlled exit.",
        "Which timing change helped you arrive ready for the next move?",
      ),
    ],
  },
  {
    id: "level-9",
    number: 9,
    title: "Projecting & independent learning",
    stage: "performance",
    courseId: "c3",
    anchor: "Gym course 3 · weakness analysis & performance",
    entry:
      "Climber can describe attempts, manage recovery and choose suitable personal projects.",
    evidence:
      "Designs an experiment, reviews its result and checks retained learning on a different problem or later session.",
    lessons: [
      lesson(
        "l9-project",
        "Useful attempts and reliable links",
        "Use overlap, finishing practice and pacing to answer a specific project question.",
        ["ax-overlap", "ax-finishlink", "ax-pace", "ax-restmap"],
        "Record one event, one hypothesis and the next comparable test.",
        "Familiar sections that can be repeated while fresh.",
        "A suitable new project with a different transition problem.",
        "What did this attempt teach us, and is another attempt useful now?",
      ),
      lesson(
        "l9-transfer",
        "Plan, vary, revisit",
        "Build a short practice cycle with a clear later transfer check.",
        ["ax-variation", "ax-delay", "rx-transfer"],
        "Observe without prompting now and at the next suitable session.",
        "Return to a familiar easy task briefly, then remove the rule.",
        "Mix relevant movement demands on a new layout.",
        "Which part of the learning persisted, and what should we test next?",
      ),
    ],
  },
];
