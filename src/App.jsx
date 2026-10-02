import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Dumbbell, Lightbulb, ChevronRight, ChevronDown, Map, Target, AlertTriangle, CheckCircle2, XCircle, Info, Play } from 'lucide-react';

// --- DATA MODEL ---
const DATABASE = {
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
      desc: 'The point where the body\'s mass is concentrated. Proper shifting of the CoG over the base of support (feet) prevents barn-dooring and saves arm strength.',
      drillIds: ['d3', 'd5', 'd6']
    },
    {
      id: 'ti', title: 'Turning In (Eindrehen)', category: 'Positioning',
      desc: 'Rotating the hip close to the wall. Extremely efficient for overhanging walls. It brings the CoG closer to the wall, increases reach, and reduces weight on the arms compared to climbing frontally.',
      drillIds: ['d4', 'd10']
    },
    {
      id: 'fl', title: 'Flagging (Ausflaggen)', category: 'Positioning',
      desc: 'Extending one leg out to the side (without stepping on a hold) to shift the Center of Gravity and prevent the body from swinging (barn-dooring) when climbing with the same hand and foot. Variations: Standard, Inside/Reverse, Backstep.',
      drillIds: ['d11', 'd12']
    },
    {
      id: 'fw', title: 'Precision Footwork', category: 'Footwork',
      desc: 'Placing the foot accurately on the best part of the hold (usually with the big toe) on the first try, without micro-adjusting, shuffling, or making noise.',
      drillIds: ['d1', 'd2', 'd13']
    },
    {
      id: 'fs', title: 'Foot Swaps', category: 'Footwork',
      desc: '1. Jump swap (quick hop).\n2. Side-by-side (placing next to each other on large holds).\n3. Roll-over (rolling over the toe).\n4. Smear swap (using the wall above the hold to swap).',
      drillIds: ['d7']
    },
    {
      id: 'gr', title: 'Grip Types & Hold Nuances', category: 'Hand Technique',
      desc: 'Jugs: Large, deep holds.\nSlopers: Round, friction-dependent. Keep CoG low.\nCrimps: Small edges. Teach "open hand" or "half-crimp". Warn against "full crimping".\nUnderclings: Pull up to generate downward force on feet.\nPockets: Isolate specific fingers.\nPinches: Require thumb engagement.',
      drillIds: ['d14', 'd15']
    },
    {
      id: 'rr', title: 'Route Reading & Tactics', category: 'Tactics',
      desc: 'Visualizing the sequence before leaving the ground. Identifying hand/foot sequences, crux moves (Schlüsselstellen), and rest positions to save mental and physical energy on the wall.',
      drillIds: ['d8', 'd16']
    },
    {
      id: 'dy', title: 'Dynamic Movement', category: 'Physics of Climbing',
      desc: 'Using momentum to reach distant holds. Includes Deadpointing (grabbing the hold at the exact moment of weightlessness) and Dynos (body completely leaves the wall).',
      drillIds: ['d17', 'd18']
    },
    {
      id: 'rs', title: 'Resting & Efficiency', category: 'Tactics',
      desc: 'Finding positions on the wall to recover forearm strength. Involves straight arms, finding knee bars, stemming in dihedrals, and actively shaking out lactic acid.',
      drillIds: ['d19', 'd20']
    },
    {
      id: 'fr', title: 'Fear Management & Falling', category: 'Mental',
      desc: 'Learning to trust the body, the mats, and the spotters. Overcoming the instinct to over-grip due to fear of falling.',
      drillIds: ['d21', 'd22']
    }
  ],
  drills: [
    {
      id: 'd1', title: 'Silent Feet (Ninja Feet)', focus: 'Precision Footwork',
      setup: 'Any vertical or slightly overhanging wall. Grade 1 or 2.',
      desc: 'A fundamental drill to cure "clumsy" feet. The climber must place their feet on the holds making absolutely zero noise.',
      execution: ['Locate the next foothold with the eyes.', 'Watch the toe touch the hold perfectly.', 'Do not look away until the foot is fully weighted.', 'If it makes a sound, step down and repeat.'],
      mistakes: ['Looking away early.', 'Smearing blindly up the wall.']
    },
    {
      id: 'd2', title: 'Sticky Feet (Glue Feet)', focus: 'Foot Positioning & Trust',
      setup: 'Easy to moderate boulder problem.',
      desc: 'Teaches climbers to place their foot correctly the first time and trust the placement, rather than micro-adjusting.',
      execution: ['Once the foot touches a hold, it is "glued".', 'No pivoting, shuffling, or bouncing.', 'If placement is bad, climb through it or step completely off to replace.'],
      mistakes: ['Hesitation.', 'Placing the middle of the foot on the hold.']
    },
    {
      id: 'd3', title: 'The Hover Hand (3-Second Rule)', focus: 'Balance & CoG',
      setup: 'Slightly overhanging wall. Grade 2.',
      desc: 'Forces perfect equilibrium before moving hands, eliminating momentum.',
      execution: ['Initiate a move.', 'Hover hand 2-3 inches above the next hold.', 'Count "One, two, three" out loud.', 'Grab the hold.'],
      mistakes: ['Slapping the hold early.', 'Barn-dooring due to bad feet.']
    },
    {
      id: 'd4', title: 'Straight Arm Climbing', focus: 'Leg Drive & Twist',
      setup: 'Overhanging wall with good jugs.',
      desc: 'Teaches generating upward movement from legs and hips, not arms.',
      execution: ['Keep arms completely straight (locked elbows).', 'Use legs to push hips up and twist torso to reach next hold.'],
      mistakes: ['Bending elbows (T-Rex arms).', 'Climbing frontally.']
    },
    {
      id: 'd5', title: 'The Carabiner Tail', focus: 'Visualizing CoG',
      setup: 'Belt, string, and heavy carabiner.',
      desc: 'The carabiner acts as a plumb line showing the center of gravity.',
      execution: ['Tie string around waist, carabiner hangs down back.', 'Climb normally.', 'Watch if carabiner hangs over the supporting foot before stepping up.'],
      mistakes: ['Moving limbs before the "tail" has shifted.']
    },
    {
      id: 'd6', title: 'Climbing from the Legs (No Hands)', focus: 'Weight Transfer',
      setup: 'Low angle slab or volume area.',
      desc: 'Isolates leg drive and forces trust in friction.',
      execution: ['Ascend the slab without using hands.', 'Take small steps, push hips forward.'],
      mistakes: ['Leaning upper body away from wall (fear response).']
    },
    {
      id: 'd7', title: 'Traverse Foot-Swap Marathon', focus: 'Foot Swaps',
      setup: 'Long traverse wall.',
      desc: 'Drills mechanics of foot swapping.',
      execution: ['Traverse horizontally.', 'Perform a foot swap on every single hold.', 'Trainer calls out "Jump!", "Roll!", etc.'],
      mistakes: ['Tangled feet.', 'Not leaving space for incoming foot.']
    },
    {
      id: 'd8', title: 'Partner Route Planning', focus: 'Route Reading',
      setup: 'Grade 2/3 boulder. Optional: Laser pointer.',
      desc: 'Develops spatial awareness before climbing.',
      execution: ['Pair up. Agree on detailed sequence.', 'Point to each hold and verbalize moves.', 'One climbs, other watches for adherence.'],
      mistakes: ['Ignoring feet in the plan.', 'Forgetting sequence halfway.']
    },
    {
      id: 'd10', title: 'Twist-Lock Traverse', focus: 'Turning In (Eindrehen)',
      setup: 'Steep traverse wall, juggy holds.',
      desc: 'Exaggerates the twisting motion to save energy.',
      execution: ['Traverse horizontally.', 'On every single move, twist the hip of the reaching arm completely into the wall.', 'Hold the twist for 2 seconds before reaching.'],
      mistakes: ['Remaining frontal.', 'Sagging hips away from the wall.']
    },
    {
      id: 'd11', title: 'Flag & Tap', focus: 'Flagging Balance',
      setup: 'Vertical wall, scattered holds.',
      desc: 'Forces the climber to find a stable flagging position.',
      execution: ['Climb using same hand and foot side (e.g., Left hand, Left foot on).', 'Flag the free leg (Right) hard out to the side.', 'Use the free hand (Right) to tap a spot on the wall far away to prove absolute balance, then continue.'],
      mistakes: ['Tapping too quickly while falling.', 'Not extending the flag leg far enough.']
    },
    {
      id: 'd12', title: 'No Matching Allowed', focus: 'Flagging & Swapping',
      setup: 'Any moderate boulder.',
      desc: 'Eliminates easy outs to force creative positioning.',
      execution: ['Climb the route.', 'Rule: You may never place two hands or two feet on the same hold.', 'Forces back-steps, flagging, and crossing over.'],
      mistakes: ['Getting stuck due to lack of foresight.']
    },
    {
      id: 'd13', title: 'The Coin Drill', focus: 'Precision Footwork',
      setup: 'Slab or vertical wall. Small coins.',
      desc: 'The ultimate precision test.',
      execution: ['Place coins on a few key footholds.', 'The climber must step exactly on the coin.', 'If the coin falls off, they must restart.'],
      mistakes: ['Smearing onto the hold.']
    },
    {
      id: 'd14', title: 'Open Hand Only', focus: 'Grip Safety',
      setup: 'Vertical wall with various edges and crimps.',
      desc: 'Protects pulleys by forcing an open-hand grip.',
      execution: ['Climb the route.', 'Rule: The thumb must NEVER wrap over the index finger (no full crimps).', 'Forces use of sloper-strength on crimps.'],
      mistakes: ['Unconsciously crimping out of fear or habit.']
    },
    {
      id: 'd15', title: 'Tennis Ball Holds', focus: 'Pinch Strength',
      setup: 'Two tennis balls (or similar objects).',
      desc: 'Forces active engagement of the thumb and pinch grip.',
      execution: ['Climber holds a tennis ball in each hand.', 'They must climb an easy route (using large volumes/slopers) without dropping the balls.', 'This completely disables the ability to use jugs.'],
      mistakes: ['Dropping balls.', 'Relying entirely on forearms on volumes.']
    },
    {
      id: 'd16', title: 'Memory Climb', focus: 'Route Reading & Focus',
      setup: 'Boulder problem with many distracting holds nearby.',
      desc: 'Tests visualization and memory.',
      execution: ['Climber visualizes the route for 1 minute.', 'Before climbing, they put on a blindfold or close their eyes (top rope/very safe low traverse only).', 'Alternatively, trainer uses laser pointer to designate the next hold ONLY when they reach the current one, testing if they remembered the plan.'],
      mistakes: ['Looking around confused on the wall.']
    },
    {
      id: 'd17', title: 'Touch & Go (Deadpointing)', focus: 'Dynamic Accuracy',
      setup: 'Overhanging wall.',
      desc: 'Isolates the "deadpoint" – the moment of weightlessness.',
      execution: ['Climber lunges for a distant hold.', 'Instead of grabbing it, they just TAP it with their fingers.', 'They must drop back to the start position under control.', 'Do this 3 times, then actually grab it on the 4th.'],
      mistakes: ['Grabbing instead of tapping.', 'Swinging wildly upon returning.']
    },
    {
      id: 'd18', title: 'Hip Thrust Isolations', focus: 'Dyno Preparation',
      setup: 'Large starting jugs, overhanging.',
      desc: 'Teaches the timing of the hips in dynamic movement.',
      execution: ['Grab start holds.', 'Pull in and throw hips aggressively up and into the wall.', 'Do not let go with the hands. Just practice the "bounce" and hip trajectory.', 'Repeat 5 times.'],
      mistakes: ['Pulling only with arms instead of thrusting hips.']
    },
    {
      id: 'd19', title: 'The 3-Second Shake', focus: 'Resting on the Wall',
      setup: 'Long endurance route.',
      desc: 'Forces active recovery.',
      execution: ['On every 3rd hand move, the climber MUST stop.', 'They must find the most relaxed position possible (straight arm).', 'Shake out the resting arm for a full 3 seconds before continuing.'],
      mistakes: ['Shaking out while holding on with a bent arm (wasting energy).']
    },
    {
      id: 'd20', title: 'Downclimbing Everything', focus: 'Efficiency & Eccentric Strength',
      setup: 'Main bouldering session.',
      desc: 'The best way to build technique and antagonist strength.',
      execution: ['For every boulder climbed, the climber must downclimb to at least the halfway mark using any holds available.', 'Forces slow, controlled, static movement.'],
      mistakes: ['Jumping from the top.', 'Dropping feet blindly while downclimbing.']
    },
    {
      id: 'd21', title: 'Progressive Fall Practice', focus: 'Fear & Falling Mechanics',
      setup: 'Safety mats, clear drop zone.',
      desc: 'De-sensitizes the fear of falling and teaches the roll.',
      execution: ['Fall 1: Drop from lowest hold. Bend knees, roll back.', 'Fall 2: Climb 1 meter, look down, let go, roll.', 'Fall 3: Climb 2 meters, push slightly away from wall, roll.', 'Never try to stick the landing standing up.'],
      mistakes: ['Putting arms out behind to catch the fall (wrist breaker).', 'Staying stiff.']
    },
    {
      id: 'd22', title: 'The Look-Down Breath', focus: 'Mental Commitment',
      setup: 'Crux move of a scary boulder.',
      desc: 'Interrupts the panic response.',
      execution: ['When feeling fear before a move, stop.', 'Look straight down at the mats (acknowledge the fall).', 'Take one massive, audible deep breath.', 'Look back up at the target hold and execute immediately.'],
      mistakes: ['Holding breath while climbing.', 'Staring at the wall while panicking.']
    }
  ]
};

// --- COMPONENTS ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

export default function TrainerApp() {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState('c1');
  const [expandedDay, setExpandedDay] = useState(1);
  const [expandedDrills, setExpandedDrills] = useState({});
  const [expandedConcept, setExpandedConcept] = useState(null);

  const toggleDrill = (id) => {
    setExpandedDrills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- SEARCH LOGIC ---
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    
    const matchedConcepts = DATABASE.concepts.filter(c => 
      c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
    const matchedDrills = DATABASE.drills.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.desc.toLowerCase().includes(q) || 
      d.focus.toLowerCase().includes(q) ||
      (d.execution && d.execution.some(e => e.toLowerCase().includes(q)))
    );
    
    return { concepts: matchedConcepts, drills: matchedDrills };
  }, [searchQuery]);

  // --- RENDERERS ---

  const renderSearchArea = () => (
    <div className="sticky top-0 bg-slate-900 pt-6 pb-4 px-4 z-10 shadow-md">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search drills, grips, concepts..." 
          className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );

  const renderDrillCard = (d) => {
    const isExpanded = expandedDrills[d.id];
    return (
      <Card key={d.id} className="border-l-4 border-l-blue-500 mb-4 transition-all">
        <button 
          onClick={() => toggleDrill(d.id)}
          className="w-full text-left p-4 focus:outline-none hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2"
        >
          <div>
            <h3 className="font-bold text-lg text-slate-800 leading-tight">{d.title}</h3>
            <span className="inline-block bg-blue-50 text-blue-700 font-medium text-xs px-2 py-1 rounded mt-2 mb-2">
              Focus: {d.focus}
            </span>
            <p className="text-sm text-slate-600 leading-relaxed pr-4 line-clamp-2">
              {d.desc}
            </p>
          </div>
          <div className="text-blue-500 bg-blue-50 p-2 rounded-full self-start shrink-0">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-white">
            <p className="text-sm text-slate-700 mb-4 italic bg-slate-50 p-3 rounded border border-slate-100">
              {d.desc}
            </p>
            
            {d.setup && (
              <div className="mb-4">
                <h4 className="font-semibold text-slate-800 flex items-center gap-1.5 text-sm mb-2">
                  <Map size={16} className="text-slate-500"/> Environment Setup
                </h4>
                <p className="text-sm text-slate-600 pl-5">{d.setup}</p>
              </div>
            )}

            {d.execution && (
              <div className="mb-4">
                <h4 className="font-semibold text-slate-800 flex items-center gap-1.5 text-sm mb-2">
                  <CheckCircle2 size={16} className="text-emerald-500"/> Execution Steps
                </h4>
                <ol className="list-decimal list-outside pl-5 space-y-1.5">
                  {d.execution.map((step, idx) => (
                    <li key={idx} className="text-sm text-slate-600 pl-1">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {d.mistakes && (
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-1.5 text-sm mb-2">
                  <XCircle size={16} className="text-red-500"/> Common Mistakes to Watch For
                </h4>
                <ul className="list-disc list-outside pl-5 space-y-1.5">
                  {d.mistakes.map((mistake, idx) => (
                    <li key={idx} className="text-sm text-slate-600 pl-1">{mistake}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  const renderSearchResults = () => (
    <div className="p-4 space-y-6 pb-28 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-slate-800">Search Results</h2>
      
      {searchResults.concepts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-emerald-600 flex items-center gap-2">
            <Lightbulb size={18} /> Concepts
          </h3>
          {searchResults.concepts.map(c => (
            <Card key={c.id} className="p-4 border-l-4 border-l-emerald-500">
              <h4 className="font-bold text-slate-800">{c.title}</h4>
              <p className="text-xs text-slate-500 mb-2">{c.category}</p>
              <p className="text-sm text-slate-600 whitespace-pre-line">{c.desc}</p>
            </Card>
          ))}
        </div>
      )}

      {searchResults.drills.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-blue-600 flex items-center gap-2 mt-6">
            <Dumbbell size={18} /> Drills & Exercises
          </h3>
          {searchResults.drills.map(renderDrillCard)}
        </div>
      )}

      {searchResults.concepts.length === 0 && searchResults.drills.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          No results found for "{searchQuery}".
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="p-4 space-y-4 pb-28 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Course Curriculums</h2>
      {DATABASE.courses.map(course => (
        <Card key={course.id} className="overflow-visible">
          <button 
            className="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50"
            onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
          >
            <div>
              <h3 className="font-bold text-lg text-slate-800">{course.title}</h3>
              <p className="text-sm text-slate-500">{course.level}</p>
            </div>
            {expandedCourse === course.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          
          {expandedCourse === course.id && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-4">
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle size={14}/> Prerequisites</h4>
                  <p className="text-sm text-slate-700">{course.prerequisites}</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Target size={14}/> Target Audience</h4>
                  <p className="text-sm text-slate-700">{course.target}</p>
                </div>
              </div>

              {course.days && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <Map size={18} className="text-emerald-600"/> Lesson Plans
                  </h4>
                  {course.days.map(day => (
                    <div key={day.day} className="bg-white border border-slate-200 rounded overflow-hidden">
                      <button 
                        className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-slate-50"
                        onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      >
                        <span className="font-semibold text-slate-700">Day {day.day}: {day.title}</span>
                        {expandedDay === day.day ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                      </button>
                      {expandedDay === day.day && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                          <ul className="space-y-3 mt-2">
                            {day.activities.map((act, i) => {
                              const [boldPart, rest] = act.includes(':') ? act.split(':') : [act, ''];
                              return (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                  <span>
                                    {rest ? <><strong className="text-slate-800">{boldPart}:</strong>{rest}</> : boldPart}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {course.topics && (
                <div className="mt-4">
                  <h4 className="font-bold text-slate-800 mb-3">Key Topics</h4>
                  <ul className="grid gap-2">
                    {course.topics.map((topic, i) => (
                      <li key={i} className="bg-white p-3 rounded shadow-sm text-sm text-slate-700 flex items-start gap-2 border border-slate-100">
                         <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                         {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderConcepts = () => (
    <div className="p-4 pb-28 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-emerald-600" size={24} />
        <h2 className="text-xl font-bold text-slate-800">Concept Library</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4 ml-1 flex items-center gap-1">
        <Info size={14}/> Tap a concept to see associated drills.
      </p>
      <div className="grid grid-cols-1 gap-4">
        {DATABASE.concepts.map(c => {
          const isExpanded = expandedConcept === c.id;
          const associatedDrills = c.drillIds ? DATABASE.drills.filter(d => c.drillIds.includes(d.id)) : [];
          
          return (
            <Card key={c.id} className={`transition-all duration-200 border-t-4 ${isExpanded ? 'border-t-emerald-600 shadow-md ring-1 ring-emerald-100' : 'border-t-emerald-400 hover:shadow-md'}`}>
              <button 
                onClick={() => setExpandedConcept(isExpanded ? null : c.id)}
                className="w-full text-left p-4 sm:p-5 focus:outline-none"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{c.title}</h3>
                    <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded mt-1 mb-3 font-medium">
                      {c.category}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'text-emerald-700 bg-emerald-100' : 'text-slate-400 bg-slate-50'}`}>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{c.desc}</p>
              </button>

              {isExpanded && associatedDrills.length > 0 && (
                <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/50">
                  <h4 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                    <Dumbbell size={16} className="text-blue-500" /> Apply this concept with these drills:
                  </h4>
                  <div className="space-y-3">
                    {associatedDrills.map(d => (
                       <div key={d.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="font-bold text-slate-700 text-sm block mb-0.5">{d.title}</span>
                            <p className="text-xs text-slate-500 line-clamp-2">{d.desc}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab('drills');
                              setExpandedDrills({ [d.id]: true });
                              setSearchQuery(d.title);
                            }}
                            className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded transition-colors flex items-center gap-1.5 shrink-0"
                          >
                            <Play size={12} /> View Drill
                          </button>
                       </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderDrills = () => (
    <div className="p-4 pb-28 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Dumbbell className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-slate-800">Drill & Exercise Library</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4 ml-1 flex items-center gap-1">
        <Info size={14}/> Click on any drill to view execution steps and common mistakes.
      </p>
      
      <div className="space-y-4">
        {DATABASE.drills.map(renderDrillCard)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Search Bar */}
      {renderSearchArea()}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {searchQuery ? renderSearchResults() : (
          <>
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'concepts' && renderConcepts()}
            {activeTab === 'drills' && renderDrills()}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe z-50">
        <div className="flex justify-around items-center p-2 max-w-md mx-auto">
          <button 
            onClick={() => { setActiveTab('courses'); setSearchQuery(''); }}
            className={`flex flex-col items-center p-2 rounded-lg w-24 transition-colors ${activeTab === 'courses' && !searchQuery ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <BookOpen size={24} className="mb-1" />
            <span className="text-xs font-medium">Courses</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('concepts'); setSearchQuery(''); }}
            className={`flex flex-col items-center p-2 rounded-lg w-24 transition-colors ${activeTab === 'concepts' && !searchQuery ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Lightbulb size={24} className="mb-1" />
            <span className="text-xs font-medium">Concepts</span>
          </button>

          <button 
            onClick={() => { setActiveTab('drills'); setSearchQuery(''); }}
            className={`flex flex-col items-center p-2 rounded-lg w-24 transition-colors ${activeTab === 'drills' && !searchQuery ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Dumbbell size={24} className="mb-1" />
            <span className="text-xs font-medium">Drills</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
