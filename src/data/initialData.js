export const DEFAULT_TAGS = [
  '#footwork',
  '#balance',
  '#overhang',
  '#slab',
  '#warmup',
  '#tactics',
  '#fear-management',
  '#grip-safety',
  '#dynamics',
  '#resting'
];

export const INITIAL_SKILLS = [
  { id: 'sk_silent', name: 'Silent Feet (Precision)', category: 'Footwork' },
  { id: 'sk_sticky', name: 'Sticky Feet (No Shuffling)', category: 'Footwork' },
  { id: 'sk_swaps', name: 'Smooth Foot Swaps', category: 'Footwork' },
  { id: 'sk_cog', name: 'Center of Gravity Control', category: 'Balance' },
  { id: 'sk_turnin', name: 'Turning In (Eindrehen)', category: 'Body Position' },
  { id: 'sk_flag', name: 'Flagging (Standard / Reverse)', category: 'Body Position' },
  { id: 'sk_arms', name: 'Straight Arm Climbing', category: 'Efficiency' },
  { id: 'sk_grip', name: 'Open Hand / Half Crimp Safety', category: 'Grip' },
  { id: 'sk_dyno', name: 'Deadpoint Timing', category: 'Dynamics' },
  { id: 'sk_fall', name: 'Controlled Fall & Roll', category: 'Safety' },
  { id: 'sk_reading', name: 'Full Sequence Route Reading', category: 'Tactics' },
  { id: 'sk_rest', name: 'Active Recovery & Shaking Out', category: 'Tactics' }
];

export const INITIAL_DATABASE = {
  courses: [
    {
      id: 'c1',
      title: 'Technique Course 1',
      level: 'Beginner',
      prerequisites: 'A few months of bouldering experience.',
      target: 'Climbers wanting to learn basics, step cleanly, and improve via group motivation.',
      days: [
        {
          day: 1,
          title: 'Center of Gravity & Grip Types',
          activities: [
            'Intro & Briefing: Meet, discuss goals, experience, and injuries.',
            'Warm-up: Swing exercises to mobilize, climb 1-2 easy routes.',
            'Concept - Center of Gravity (CoG): Demonstrate how CoG shifts when lifting a leg or doing lunges.',
            'Concept - Grip Types: Identify jugs, slopers, crimps, underclings. Discuss how grip direction dictates body position.',
            'Application: Climb in the main hall. Focus on safe grip (no full crimps) and CoG.',
            'Cool-down: 10-15 mins stretching.'
          ]
        },
        {
          day: 2,
          title: 'Footwork & Body Positioning',
          activities: [
            'Review: Discuss last week and independent practice.',
            'Warm-up: Focus on hips and legs. Climb yellow/green routes.',
            'Concept - Foot Swaps: Demonstrate jumping, smearing, rolling, and side-by-side swaps.',
            'Concept - Frontal vs. Turned-in: Compare energy costs. Frontal = good for slabs. Turned-in = saves energy on overhangs, increases reach.',
            'Application: Climb routes purely frontally, then purely turned-in.',
            'Cool-down: 10-15 mins stretching.'
          ]
        },
        {
          day: 3,
          title: 'Route Reading & Dynamics',
          activities: [
            'Warm-up: Climb 5 easy routes applying previous techniques.',
            'Concept - Static vs. Dynamic: Static = movement can be paused anytime. Dynamic = uses momentum (e.g., deadpoints, dynos).',
            'Concept - Hooks: Demonstrate Heel-hook and Toe-hook applications.',
            'Concept - Route Reading: Discuss hand/foot sequence before climbing. Did reality match the plan?',
            'Application: Pair up, read a grade 2/3 route, discuss the most efficient path, and test it.',
            'Cool-down: 10-15 mins stretching.'
          ]
        },
        {
          day: 4,
          title: 'Application & Open Review',
          activities: [
            'Review: Address specific participant requests or struggles.',
            'Warm-up: Easy grade 1 and 2 routes.',
            'Application: Pair up in main hall on grade 3s. Mandatory route reading before every climb.',
            'Trainer Role: Walk around, spot correct, and give individualized tips.',
            'Closing: Cool-down, final feedback round, distribute feedback forms.'
          ]
        }
      ]
    },
    {
      id: 'c2',
      title: 'Technique Course 2',
      level: 'Intermediate',
      prerequisites: 'Approx. 1 year experience, safely climbing grade 3.',
      target: 'Climbers wanting to tackle harder routes with beautiful technique, not just power.',
      topics: [
        'Advanced Footwork: Heel hooks, Toe hooks.',
        'Advanced Grips: Crimps, Slopers, Volumes, Thumb catches (kontern).',
        'Advanced Techniques: Mantles, Dynos, Flagging, Cross-overs, Gastons.',
        'Tactics: Crux identification, Rest positions, Projecting, Spotting.',
        'Injury Prevention: Warm-up/Cool-down, Compensatory training (e.g., Therabands).'
      ]
    },
    {
      id: 'c3',
      title: 'Technique Course 3 (Advanced)',
      level: 'Advanced',
      prerequisites: '1+ years experience, safely climbing grade 4.',
      target: 'Climbers training 2x/week, tackling heavy projects, or aiming for competitions.',
      topics: [
        'Special Techniques & Weakness Analysis.',
        'Jumps, Dynos, and Competition-style coordination.',
        'Off-the-wall training: Mobility & Compensatory training.',
        'Distinction from pure strength courses (Moonboard, Campus board, etc.).'
      ]
    }
  ],
  concepts: [
    {
      id: 'cg', title: 'Center of Gravity (CoG)', category: 'Physics of Climbing',
      tags: ['#balance', '#slab'],
      desc: 'The point where the body\'s mass is concentrated. Proper shifting of the CoG over the base of support (feet) prevents barn-dooring and saves arm strength.',
      drillIds: ['d3', 'd5', 'd6']
    },
    {
      id: 'ti', title: 'Turning In (Eindrehen)', category: 'Positioning',
      tags: ['#overhang', '#balance'],
      desc: 'Rotating the hip close to the wall. Extremely efficient for overhanging walls. It brings the CoG closer to the wall, increases reach, and reduces weight on the arms compared to climbing frontally.',
      drillIds: ['d4', 'd10']
    },
    {
      id: 'fl', title: 'Flagging (Ausflaggen)', category: 'Positioning',
      tags: ['#balance', '#overhang'],
      desc: 'Extending one leg out to the side (without stepping on a hold) to shift the Center of Gravity and prevent the body from swinging (barn-dooring) when climbing with the same hand and foot. Variations: Standard, Inside/Reverse, Backstep.',
      drillIds: ['d11', 'd12']
    },
    {
      id: 'fw', title: 'Precision Footwork', category: 'Footwork',
      tags: ['#footwork', '#slab'],
      desc: 'Placing the foot accurately on the best part of the hold (usually with the big toe) on the first try, without micro-adjusting, shuffling, or making noise.',
      drillIds: ['d1', 'd2', 'd13']
    },
    {
      id: 'fs', title: 'Foot Swaps', category: 'Footwork',
      tags: ['#footwork'],
      desc: '1. Jump swap (quick hop).\n2. Side-by-side (placing next to each other on large holds).\n3. Roll-over (rolling over the toe).\n4. Smear swap (using the wall above the hold to swap).',
      drillIds: ['d7']
    },
    {
      id: 'gr', title: 'Grip Types & Hold Nuances', category: 'Hand Technique',
      tags: ['#grip-safety'],
      desc: 'Jugs: Large, deep holds.\nSlopers: Round, friction-dependent. Keep CoG low.\nCrimps: Small edges. Teach "open hand" or "half-crimp". Warn against "full crimping".\nUnderclings: Pull up to generate downward force on feet.\nPockets: Isolate specific fingers.\nPinches: Require thumb engagement.',
      drillIds: ['d14', 'd15']
    },
    {
      id: 'rr', title: 'Route Reading & Tactics', category: 'Tactics',
      tags: ['#tactics'],
      desc: 'Visualizing the sequence before leaving the ground. Identifying hand/foot sequences, crux moves (Schlüsselstellen), and rest positions to save mental and physical energy on the wall.',
      drillIds: ['d8', 'd16']
    },
    {
      id: 'dy', title: 'Dynamic Movement', category: 'Physics of Climbing',
      tags: ['#dynamics'],
      desc: 'Using momentum to reach distant holds. Includes Deadpointing (grabbing the hold at the exact moment of weightlessness) and Dynos (body completely leaves the wall).',
      drillIds: ['d17', 'd18']
    },
    {
      id: 'rs', title: 'Resting & Efficiency', category: 'Tactics',
      tags: ['#resting', '#tactics'],
      desc: 'Finding positions on the wall to recover forearm strength. Involves straight arms, finding knee bars, stemming in dihedrals, and actively shaking out lactic acid.',
      drillIds: ['d19', 'd20']
    },
    {
      id: 'fr', title: 'Fear Management & Falling', category: 'Mental',
      tags: ['#fear-management'],
      desc: 'Learning to trust the body, the mats, and the spotters. Overcoming the instinct to over-grip due to fear of falling.',
      drillIds: ['d21', 'd22']
    }
  ],
  drills: [
    {
      id: 'd1', title: 'Silent Feet (Ninja Feet)', focus: 'Precision Footwork',
      tags: ['#footwork', '#warmup'],
      visualType: 'footwork',
      setup: 'Any vertical or slightly overhanging wall. Grade 1 or 2.',
      desc: 'A fundamental drill to cure "clumsy" feet. The climber must place their feet on the holds making absolutely zero noise.',
      execution: ['Locate the next foothold with the eyes.', 'Watch the toe touch the hold perfectly.', 'Do not look away until the foot is fully weighted.', 'If it makes a sound, step down and repeat.'],
      mistakes: ['Looking away early.', 'Smearing blindly up the wall.']
    },
    {
      id: 'd2', title: 'Sticky Feet (Glue Feet)', focus: 'Foot Positioning & Trust',
      tags: ['#footwork'],
      visualType: 'footwork',
      setup: 'Easy to moderate boulder problem.',
      desc: 'Teaches climbers to place their foot correctly the first time and trust the placement, rather than micro-adjusting.',
      execution: ['Once the foot touches a hold, it is "glued".', 'No pivoting, shuffling, or bouncing.', 'If placement is bad, climb through it or step completely off to replace.'],
      mistakes: ['Hesitation.', 'Placing the middle of the foot on the hold.']
    },
    {
      id: 'd3', title: 'The Hover Hand (3-Second Rule)', focus: 'Balance & CoG',
      tags: ['#balance', '#overhang'],
      timerSeconds: 3,
      visualType: 'hover',
      setup: 'Slightly overhanging wall. Grade 2.',
      desc: 'Forces perfect equilibrium before moving hands, eliminating momentum.',
      execution: ['Initiate a move.', 'Hover hand 2-3 inches above the next hold.', 'Count "One, two, three" out loud or use the built-in timer.', 'Grab the hold.'],
      mistakes: ['Slapping the hold early.', 'Barn-dooring due to bad feet.']
    },
    {
      id: 'd4', title: 'Straight Arm Climbing', focus: 'Leg Drive & Twist',
      tags: ['#overhang', '#resting'],
      visualType: 'straight-arms',
      setup: 'Overhanging wall with good jugs.',
      desc: 'Teaches generating upward movement from legs and hips, not arms.',
      execution: ['Keep arms completely straight (locked elbows).', 'Use legs to push hips up and twist torso to reach next hold.'],
      mistakes: ['Bending elbows (T-Rex arms).', 'Climbing frontally.']
    },
    {
      id: 'd5', title: 'The Carabiner Tail', focus: 'Visualizing CoG',
      tags: ['#balance', '#slab'],
      visualType: 'cog',
      setup: 'Belt, string, and heavy carabiner.',
      desc: 'The carabiner acts as a plumb line showing the center of gravity.',
      execution: ['Tie string around waist, carabiner hangs down back.', 'Climb normally.', 'Watch if carabiner hangs over the supporting foot before stepping up.'],
      mistakes: ['Moving limbs before the "tail" has shifted.']
    },
    {
      id: 'd6', title: 'Climbing from the Legs (No Hands)', focus: 'Weight Transfer',
      tags: ['#balance', '#slab'],
      setup: 'Low angle slab or volume area.',
      desc: 'Isolates leg drive and forces trust in friction.',
      execution: ['Ascend the slab without using hands.', 'Take small steps, push hips forward.'],
      mistakes: ['Leaning upper body away from wall (fear response).']
    },
    {
      id: 'd7', title: 'Traverse Foot-Swap Marathon', focus: 'Foot Swaps',
      tags: ['#footwork', '#warmup'],
      visualType: 'swaps',
      setup: 'Long traverse wall.',
      desc: 'Drills mechanics of foot swapping.',
      execution: ['Traverse horizontally.', 'Perform a foot swap on every single hold.', 'Trainer calls out "Jump!", "Roll!", etc.'],
      mistakes: ['Tangled feet.', 'Not leaving space for incoming foot.']
    },
    {
      id: 'd8', title: 'Partner Route Planning', focus: 'Route Reading',
      tags: ['#tactics'],
      setup: 'Grade 2/3 boulder. Optional: Laser pointer or Route Drawer.',
      desc: 'Develops spatial awareness before climbing.',
      execution: ['Pair up. Agree on detailed sequence.', 'Point to each hold and verbalize moves.', 'One climbs, other watches for adherence.'],
      mistakes: ['Ignoring feet in the plan.', 'Forgetting sequence halfway.']
    },
    {
      id: 'd10', title: 'Twist-Lock Traverse', focus: 'Turning In (Eindrehen)',
      tags: ['#overhang', '#balance'],
      timerSeconds: 2,
      visualType: 'turnin',
      setup: 'Steep traverse wall, juggy holds.',
      desc: 'Exaggerates the twisting motion to save energy.',
      execution: ['Traverse horizontally.', 'On every single move, twist the hip of the reaching arm completely into the wall.', 'Hold the twist for 2 seconds before reaching.'],
      mistakes: ['Remaining frontal.', 'Sagging hips away from the wall.']
    },
    {
      id: 'd11', title: 'Flag & Tap', focus: 'Flagging Balance',
      tags: ['#balance', '#overhang'],
      visualType: 'flagging',
      setup: 'Vertical wall, scattered holds.',
      desc: 'Forces the climber to find a stable flagging position.',
      execution: ['Climb using same hand and foot side (e.g., Left hand, Left foot on).', 'Flag the free leg (Right) hard out to the side.', 'Use the free hand (Right) to tap a spot on the wall far away to prove absolute balance, then continue.'],
      mistakes: ['Tapping too quickly while falling.', 'Not extending the flag leg far enough.']
    },
    {
      id: 'd12', title: 'No Matching Allowed', focus: 'Flagging & Swapping',
      tags: ['#footwork', '#balance'],
      setup: 'Any moderate boulder.',
      desc: 'Eliminates easy outs to force creative positioning.',
      execution: ['Climb the route.', 'Rule: You may never place two hands or two feet on the same hold.', 'Forces back-steps, flagging, and crossing over.'],
      mistakes: ['Getting stuck due to lack of foresight.']
    },
    {
      id: 'd13', title: 'The Coin Drill', focus: 'Precision Footwork',
      tags: ['#footwork', '#slab'],
      setup: 'Slab or vertical wall. Small coins.',
      desc: 'The ultimate precision test.',
      execution: ['Place coins on a few key footholds.', 'The climber must step exactly on the coin.', 'If the coin falls off, they must restart.'],
      mistakes: ['Smearing onto the hold.']
    },
    {
      id: 'd14', title: 'Open Hand Only', focus: 'Grip Safety',
      tags: ['#grip-safety'],
      visualType: 'grip',
      setup: 'Vertical wall with various edges and crimps.',
      desc: 'Protects pulleys by forcing an open-hand grip.',
      execution: ['Climb the route.', 'Rule: The thumb must NEVER wrap over the index finger (no full crimps).', 'Forces use of sloper-strength on crimps.'],
      mistakes: ['Unconsciously crimping out of fear or habit.']
    },
    {
      id: 'd15', title: 'Tennis Ball Holds', focus: 'Pinch Strength',
      tags: ['#grip-safety'],
      setup: 'Two tennis balls (or similar objects).',
      desc: 'Forces active engagement of the thumb and pinch grip.',
      execution: ['Climber holds a tennis ball in each hand.', 'They must climb an easy route (using large volumes/slopers) without dropping the balls.', 'This completely disables the ability to use jugs.'],
      mistakes: ['Dropping balls.', 'Relying entirely on forearms on volumes.']
    },
    {
      id: 'd16', title: 'Memory Climb', focus: 'Route Reading & Focus',
      tags: ['#tactics'],
      setup: 'Boulder problem with many distracting holds nearby.',
      desc: 'Tests visualization and memory.',
      execution: ['Climber visualizes the route for 1 minute.', 'Before climbing, they put on a blindfold or close their eyes (top rope/very safe low traverse only).', 'Alternatively, trainer uses laser pointer to designate the next hold ONLY when they reach the current one, testing if they remembered the plan.'],
      mistakes: ['Looking around confused on the wall.']
    },
    {
      id: 'd17', title: 'Touch & Go (Deadpointing)', focus: 'Dynamic Accuracy',
      tags: ['#dynamics', '#overhang'],
      visualType: 'deadpoint',
      setup: 'Overhanging wall.',
      desc: 'Isolates the "deadpoint" – the moment of weightlessness.',
      execution: ['Climber lunges for a distant hold.', 'Instead of grabbing it, they just TAP it with their fingers.', 'They must drop back to the start position under control.', 'Do this 3 times, then actually grab it on the 4th.'],
      mistakes: ['Grabbing instead of tapping.', 'Swinging wildly upon returning.']
    },
    {
      id: 'd18', title: 'Hip Thrust Isolations', focus: 'Dyno Preparation',
      tags: ['#dynamics'],
      setup: 'Large starting jugs, overhanging.',
      desc: 'Teaches the timing of the hips in dynamic movement.',
      execution: ['Grab start holds.', 'Pull in and throw hips aggressively up and into the wall.', 'Do not let go with the hands. Just practice the "bounce" and hip trajectory.', 'Repeat 5 times.'],
      mistakes: ['Pulling only with arms instead of thrusting hips.']
    },
    {
      id: 'd19', title: 'The 3-Second Shake', focus: 'Resting on the Wall',
      tags: ['#resting', '#tactics'],
      timerSeconds: 3,
      setup: 'Long endurance route.',
      desc: 'Forces active recovery.',
      execution: ['On every 3rd hand move, the climber MUST stop.', 'They must find the most relaxed position possible (straight arm).', 'Shake out the resting arm for a full 3 seconds before continuing.'],
      mistakes: ['Shaking out while holding on with a bent arm (wasting energy).']
    },
    {
      id: 'd20', title: 'Downclimbing Everything', focus: 'Efficiency & Eccentric Strength',
      tags: ['#warmup', '#footwork', '#resting'],
      setup: 'Main bouldering session.',
      desc: 'The best way to build technique and antagonist strength.',
      execution: ['For every boulder climbed, the climber must downclimb to at least the halfway mark using any holds available.', 'Forces slow, controlled, static movement.'],
      mistakes: ['Jumping from the top.', 'Dropping feet blindly while downclimbing.']
    },
    {
      id: 'd21', title: 'Progressive Fall Practice', focus: 'Fear & Falling Mechanics',
      tags: ['#fear-management', '#warmup'],
      visualType: 'falling',
      setup: 'Safety mats, clear drop zone.',
      desc: 'De-sensitizes the fear of falling and teaches the roll.',
      execution: ['Fall 1: Drop from lowest hold. Bend knees, roll back.', 'Fall 2: Climb 1 meter, look down, let go, roll.', 'Fall 3: Climb 2 meters, push slightly away from wall, roll.', 'Never try to stick the landing standing up.'],
      mistakes: ['Putting arms out behind to catch the fall (wrist breaker).', 'Staying stiff.']
    },
    {
      id: 'd22', title: 'The Look-Down Breath', focus: 'Mental Commitment',
      tags: ['#fear-management'],
      setup: 'Crux move of a scary boulder.',
      desc: 'Interrupts the panic response.',
      execution: ['When feeling fear before a move, stop.', 'Look straight down at the mats (acknowledge the fall).', 'Take one massive, audible deep breath.', 'Look back up at the target hold and execute immediately.'],
      mistakes: ['Holding breath while climbing.', 'Staring at the wall while panicking.']
    }
  ]
};
