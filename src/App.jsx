import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, BookOpen, Dumbbell, Lightbulb, ChevronRight, ChevronDown, 
  Map, Target, AlertTriangle, CheckCircle2, XCircle, Info, Play, 
  Star, Plus, Timer, Edit3, Users, QrCode, Cloud, Tag, X,
  ShoppingBag, Sparkles, Filter, Check, Award
} from 'lucide-react';

import { INITIAL_DATABASE, DEFAULT_TAGS } from './data/initialData';
import DemonstrationVisual from './components/DemonstrationVisual';
import RouteDrawer from './components/RouteDrawer';
import DrillTimerModal from './components/DrillTimerModal';
import BodyTensionSession from './components/BodyTensionSession';
import { BODY_TENSION_DRILLS, BODY_TENSION_SESSION } from './data/bodyTension';
import { DEFAULT_CONFIG, normalizeConfig, buildPhases } from './utils/workoutTimer';
import SessionBuilderDrawer from './components/SessionBuilderDrawer';
import StudentManager from './components/StudentManager';
import QuickAddDrillModal from './components/QuickAddDrillModal';
import FeedbackQrModal from './components/FeedbackQrModal';
import SyncModal from './components/SyncModal';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

export default function TrainerApp() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'concepts', 'drills', 'students', 'tools'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Accordion States
  const [expandedCourse, setExpandedCourse] = useState('c1');
  const [expandedDay, setExpandedDay] = useState(1);
  const [expandedDrills, setExpandedDrills] = useState({});
  const [expandedConcept, setExpandedConcept] = useState(null);

  // Persistent States (localStorage)
  const [customDrills, setCustomDrills] = useState(() => {
    try {
      const saved = localStorage.getItem('boulder_custom_drills');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('boulder_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return ['d1', 'd3', 'cg']; }
  });

  const [sessionItems, setSessionItems] = useState(() => {
    try {
      const saved = localStorage.getItem('boulder_current_session');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [savedTemplates, setSavedTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('boulder_saved_templates');
      return saved ? JSON.parse(saved) : [
        {
          name: 'Day 1 Core Drills',
          items: [
            { id: 'd1', title: 'Silent Feet (Ninja Feet)', type: 'drill', focus: 'Precision Footwork', timerSeconds: null },
            { id: 'd3', title: 'The Hover Hand (3-Second Rule)', type: 'drill', focus: 'Balance & CoG', timerSeconds: 3 }
          ]
        }
      ];
    } catch { return []; }
  });

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('boulder_students');
      return saved ? JSON.parse(saved) : [
        {
          id: 'stud_1',
          name: 'Sarah Jenkins',
          className: 'Technique Course 1',
          goal: 'Footwork precision & stop full crimping',
          skills: { sk_silent: 'mastered', sk_sticky: 'practicing' },
          notes: [
            { id: 'n1', date: 'Oct 2', text: 'Clean footwork on slabs! Remind her to keep thumb open on crimps.' }
          ]
        },
        {
          id: 'stud_2',
          name: 'Marc Torres',
          className: 'Technique Course 1',
          goal: 'Overhangs & turning in',
          skills: { sk_turnin: 'practicing' },
          notes: [
            { id: 'n2', date: 'Oct 2', text: 'Tends to climb frontally. Twist-Lock drill helped save arm energy.' }
          ]
        }
      ];
    } catch { return []; }
  });

  const [customMediaUrls, setCustomMediaUrls] = useState(() => {
    try {
      const saved = localStorage.getItem('boulder_custom_media');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Modal Dialog States
  const [isRouteDrawerOpen, setIsRouteDrawerOpen] = useState(false);
  const [activeTimerConfig, setActiveTimerConfig] = useState(() => {
    if (!location.hash.startsWith('#timer=')) return null;
    try {
      const shared = JSON.parse(decodeURIComponent(location.hash.slice(7)));
      const config = normalizeConfig(shared.config);
      buildPhases(config);
      return { title: typeof shared.title === 'string' ? shared.title : 'Shared workout', config };
    } catch { return null; }
  });
  useEffect(() => {
    if (activeTimerConfig?.config && location.hash.startsWith('#timer=')) {
      // Import once so a later refresh can resume a saved workout normally.
      history.replaceState(null, '', location.pathname + location.search);
    }
  }, [activeTimerConfig]);
  const [isSessionDrawerOpen, setIsSessionDrawerOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isFeedbackQrOpen, setIsFeedbackQrOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('boulder_custom_drills', JSON.stringify(customDrills));
  }, [customDrills]);

  useEffect(() => {
    localStorage.setItem('boulder_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('boulder_current_session', JSON.stringify(sessionItems));
  }, [sessionItems]);

  useEffect(() => {
    localStorage.setItem('boulder_saved_templates', JSON.stringify(savedTemplates));
  }, [savedTemplates]);

  useEffect(() => {
    localStorage.setItem('boulder_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('boulder_custom_media', JSON.stringify(customMediaUrls));
  }, [customMediaUrls]);

  // Merge default + custom drills
  const allDrills = useMemo(() => {
    return [...customDrills, ...INITIAL_DATABASE.drills];
  }, [customDrills]);

  // --- FAVORITES TOGGLE ---
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // --- SESSION BUILDER ACTIONS ---
  const addToSession = (item, type = 'drill') => {
    if (sessionItems.some(i => i.id === item.id)) {
      setIsSessionDrawerOpen(true);
      return;
    }
    const newItem = {
      id: item.id,
      title: item.title,
      type,
      category: item.category,
      focus: item.focus,
      timerSeconds: item.timerSeconds,
      tags: item.tags,
      completed: false
    };
    setSessionItems(prev => [...prev, newItem]);
    setIsSessionDrawerOpen(true);
  };

  const removeFromSession = (id) => {
    setSessionItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleSessionItemComplete = (id) => {
    setSessionItems(prev => prev.map(i => 
      i.id === id ? { ...i, completed: !i.completed } : i
    ));
  };

  const clearSession = () => {
    setSessionItems([]);
  };

  const saveSessionTemplate = (name) => {
    const newTmpl = { name, items: sessionItems };
    setSavedTemplates(prev => [...prev.filter(t => t.name !== name), newTmpl]);
  };

  const loadSessionTemplate = (tmpl) => {
    setSessionItems(tmpl.items.map(i => ({ ...i, completed: false })));
  };

  const deleteSessionTemplate = (name) => {
    setSavedTemplates(prev => prev.filter(t => t.name !== name));
  };

  const toggleDrill = (id) => {
    setExpandedDrills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateMediaUrl = (drillId, url) => {
    setCustomMediaUrls(prev => ({ ...prev, [drillId]: url }));
  };

  // --- SEARCH & FILTER LOGIC ---
  const filteredConcepts = useMemo(() => {
    return INITIAL_DATABASE.concepts.filter(c => {
      if (onlyFavorites && !favorites.includes(c.id)) return false;
      if (selectedTag && (!c.tags || !c.tags.includes(selectedTag))) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery, selectedTag, onlyFavorites, favorites]);

  const filteredDrills = useMemo(() => {
    return allDrills.filter(d => {
      if (onlyFavorites && !favorites.includes(d.id)) return false;
      if (selectedTag && (!d.tags || !d.tags.includes(selectedTag))) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return d.title.toLowerCase().includes(q) || 
               d.desc.toLowerCase().includes(q) || 
               d.focus.toLowerCase().includes(q) ||
               (d.execution && d.execution.some(e => e.toLowerCase().includes(q))) ||
               (d.tags && d.tags.some(t => t.toLowerCase().includes(q)));
      }
      return true;
    });
  }, [allDrills, searchQuery, selectedTag, onlyFavorites, favorites]);

  // --- RENDER TOP SEARCH AREA ---
  const renderTopBar = () => (
    <header className="sticky top-0 bg-slate-900 pt-3 pb-2 px-3 z-30 shadow-md">
      <div className="max-w-md mx-auto space-y-2">
        {/* Search Input & Quick Action Icons */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search drills, grips, tags..." 
              className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Favorites Filter Button */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            title="Show Starred Only"
            className={`p-2 rounded-xl border transition-all ${
              onlyFavorites 
                ? 'bg-amber-500 border-amber-400 text-white shadow-md' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-400'
            }`}
          >
            <Star size={16} fill={onlyFavorites ? "currentColor" : "none"} />
          </button>

          {/* Interactive Route Drawer Shortcut */}
          <button
            onClick={() => setIsRouteDrawerOpen(true)}
            title="Open Route Drawer (Chalkboard)"
            className="p-2 bg-slate-800 border border-slate-700 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-xl transition-all"
          >
            <Edit3 size={16} />
          </button>

          {/* Session Builder Cart Tray */}
          <button
            onClick={() => setIsSessionDrawerOpen(true)}
            title="Open Custom Session Builder"
            className="relative p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md"
          >
            <ShoppingBag size={16} />
            {sessionItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {sessionItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Quick Tag Filtering Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-0.5 rounded-full font-medium transition-all shrink-0 ${
              selectedTag === null && !onlyFavorites
                ? 'bg-emerald-500 text-slate-950 font-bold' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          {DEFAULT_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2 py-0.5 rounded-full font-medium transition-all shrink-0 ${
                selectedTag === tag 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </header>
  );

  // --- DRILL CARD COMPONENT ---
  const renderDrillCard = (d) => {
    const isExpanded = expandedDrills[d.id];
    const isFav = favorites.includes(d.id);
    const inSession = sessionItems.some(i => i.id === d.id);
    const customMedia = customMediaUrls[d.id];

    return (
      <Card key={d.id} className="border-l-4 border-l-blue-500 mb-3.5 transition-all">
        {/* Card Header & Controls */}
        <div className="p-3 sm:p-4 hover:bg-slate-50 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <button 
              onClick={() => toggleDrill(d.id)}
              className="text-left flex-1 min-w-0"
            >
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-800 leading-tight">
                  {d.title}
                </h3>
                {d.isCustom && (
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold uppercase">
                    Custom
                  </span>
                )}
              </div>
              <span className="inline-block bg-blue-50 text-blue-700 font-semibold text-[11px] px-2 py-0.5 rounded mt-1.5 mb-1">
                Focus: {d.focus}
              </span>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {d.desc}
              </p>
            </button>

            {/* Quick Actions (Favorite & Add to Session) */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(d.id); }}
                className={`p-1.5 rounded-lg transition-colors ${isFav ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'}`}
                title={isFav ? "Remove Favorite" : "Favorite Drill"}
              >
                <Star size={16} fill={isFav ? "currentColor" : "none"} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); addToSession(d, 'drill'); }}
                className={`p-1.5 rounded-lg transition-colors ${inSession ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 hover:bg-slate-200'}`}
                title="Add to Daily Session Plan"
              >
                <Plus size={16} />
              </button>

              <button
                onClick={() => toggleDrill(d.id)}
                className="text-blue-500 bg-blue-50 p-1.5 rounded-full hover:bg-blue-100 ml-0.5"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>

          {/* Tag Pills */}
          {d.tags && d.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {d.tags.map(t => (
                <button
                  key={t}
                  onClick={(e) => { e.stopPropagation(); setSelectedTag(t); }}
                  className="text-[10px] bg-slate-100 text-slate-500 hover:bg-slate-200 px-2 py-0.5 rounded"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Expanded View with Timer & Visuals */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-white space-y-3.5">
            {/* Action Bar (Floor Timer Trigger) */}
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <Timer size={16} className="text-emerald-600" />
                <span>
                  {d.timerSeconds ? `${d.timerSeconds}-Second Drill Timer` : 'Floor Stopwatch / Interval Timer'}
                </span>
              </div>
              <button
                onClick={() => setActiveTimerConfig({ seconds: d.timerSeconds || 3, title: d.title })}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Play size={12} /> Start Timer
              </button>
            </div>

            {/* Visual & Media Demonstration (Looping GIF / Animated SVG) */}
            <div>
              <h4 className="font-semibold text-slate-800 text-xs flex items-center gap-1.5 mb-1">
                <Sparkles size={14} className="text-amber-500" /> Movement Demonstration
              </h4>
              <DemonstrationVisual
                visualType={d.visualType}
                customMediaUrl={customMedia}
                onUpdateMediaUrl={(url) => handleUpdateMediaUrl(d.id, url)}
              />
            </div>

            {/* Environment Setup */}
            {d.setup && (
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs mb-1">
                  <Map size={14} className="text-slate-500"/> Environment Setup
                </h4>
                <p className="text-xs text-slate-600 pl-4">{d.setup}</p>
              </div>
            )}

            {/* Execution Steps */}
            {d.execution && (
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs mb-1">
                  <CheckCircle2 size={14} className="text-emerald-500"/> Execution Steps
                </h4>
                <ol className="list-decimal list-outside pl-4 space-y-1">
                  {d.execution.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-600 pl-1">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Common Mistakes */}
            {d.mistakes && (
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs mb-1">
                  <XCircle size={14} className="text-red-500"/> Common Mistakes to Watch For
                </h4>
                <ul className="list-disc list-outside pl-4 space-y-1">
                  {d.mistakes.map((mistake, idx) => (
                    <li key={idx} className="text-xs text-slate-600 pl-1">{mistake}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  // --- RENDER COURSES TAB ---
  const renderCourses = () => (
    <div className="p-4 space-y-4 pb-28 max-w-md mx-auto">
      <BodyTensionSession
        renderDrill={renderDrillCard}
        onAddSession={() => {
          setSessionItems(items => [...items, ...BODY_TENSION_DRILLS.filter(d => !items.some(i => i.id === d.id)).map(d => ({ ...d, type: 'drill', completed: false }))]);
          setIsSessionDrawerOpen(true);
        }}
        onStartTimer={() => setActiveTimerConfig({
          title: BODY_TENSION_SESSION.title,
          config: { ...DEFAULT_CONFIG, mode: 'mix', intro: 10, blocks: BODY_TENSION_SESSION.blocks.map((block, i) => ({
            ...DEFAULT_CONFIG, id: `bt-block-${i}`, mode: 'work', label: block.title, duration: block.minutes * 60, intro: 0,
          })) },
        })}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Course Curriculums</h2>
        <span className="text-xs text-slate-500">Bouldering Progression</span>
      </div>

      {INITIAL_DATABASE.courses.map(course => (
        <Card key={course.id} className="overflow-visible">
          <button 
            className="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
            onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
          >
            <div>
              <h3 className="font-bold text-base text-slate-800">{course.title}</h3>
              <p className="text-xs text-slate-500">{course.level}</p>
            </div>
            {expandedCourse === course.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          
          {expandedCourse === course.id && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle size={13}/> Prerequisites
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{course.prerequisites}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Target size={13}/> Target Audience
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{course.target}</p>
                </div>
              </div>

              {course.days && (
                <div className="mt-3 space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs mb-2">
                    <Map size={15} className="text-emerald-600"/> 4-Week Lesson Plans
                  </h4>
                  {course.days.map(day => (
                    <div key={day.day} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <button 
                        className="w-full text-left px-3.5 py-2.5 flex justify-between items-center hover:bg-slate-50 text-xs font-semibold text-slate-700"
                        onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      >
                        <span>Day {day.day}: {day.title}</span>
                        {expandedDay === day.day ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                      </button>
                      {expandedDay === day.day && (
                        <div className="px-3.5 pb-3 pt-1 border-t border-slate-100">
                          <ul className="space-y-2 mt-1">
                            {day.activities.map((act, i) => {
                              const [boldPart, rest] = act.includes(':') ? act.split(':') : [act, ''];
                              return (
                                <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                  <span>
                                    {rest ? <><strong className="text-slate-800 font-semibold">{boldPart}:</strong>{rest}</> : boldPart}
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
                <div className="mt-3">
                  <h4 className="font-bold text-slate-800 text-xs mb-2">Curriculum Topics</h4>
                  <ul className="grid gap-1.5">
                    {course.topics.map((topic, i) => (
                      <li key={i} className="bg-white p-2.5 rounded shadow-sm text-xs text-slate-700 flex items-start gap-2 border border-slate-100">
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

  // --- RENDER CONCEPTS TAB ---
  const renderConcepts = () => (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-emerald-600" size={22} />
          <h2 className="text-xl font-bold text-slate-800">Concept Library</h2>
        </div>
        <span className="text-xs text-slate-500">{filteredConcepts.length} concepts</span>
      </div>

      <div className="space-y-3">
        {filteredConcepts.map(c => {
          const isExpanded = expandedConcept === c.id;
          const isFav = favorites.includes(c.id);
          const inSession = sessionItems.some(i => i.id === c.id);
          const associatedDrills = c.drillIds ? allDrills.filter(d => c.drillIds.includes(d.id)) : [];

          return (
            <Card key={c.id} className={`transition-all border-t-4 ${isExpanded ? 'border-t-emerald-600 shadow-md ring-1 ring-emerald-100' : 'border-t-emerald-400'}`}>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <button 
                    onClick={() => setExpandedConcept(isExpanded ? null : c.id)}
                    className="text-left flex-1"
                  >
                    <h3 className="font-bold text-base text-slate-800">{c.title}</h3>
                    <span className="inline-block bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded mt-1 font-medium">
                      {c.category}
                    </span>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleFavorite(c.id)}
                      className={`p-1.5 rounded-lg ${isFav ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'}`}
                      title={isFav ? "Remove Favorite" : "Favorite Concept"}
                    >
                      <Star size={16} fill={isFav ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => addToSession(c, 'concept')}
                      className={`p-1.5 rounded-lg ${inSession ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 hover:bg-slate-100'}`}
                      title="Add to Daily Session Plan"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => setExpandedConcept(isExpanded ? null : c.id)}
                      className={`p-1.5 rounded-full ${isExpanded ? 'text-emerald-700 bg-emerald-100' : 'text-slate-400 bg-slate-50'}`}
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed mt-2.5">
                  {c.desc}
                </p>
              </div>

              {isExpanded && associatedDrills.length > 0 && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60">
                  <h4 className="font-semibold text-slate-800 text-xs mb-2.5 flex items-center gap-1.5">
                    <Dumbbell size={14} className="text-blue-500" /> Apply this concept with these drills:
                  </h4>
                  <div className="space-y-2">
                    {associatedDrills.map(d => (
                       <div key={d.id} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-700 text-xs block truncate">{d.title}</span>
                            <span className="text-[10px] text-slate-400">{d.focus}</span>
                          </div>
                          <button 
                            onClick={() => {
                              setActiveTab('drills');
                              setExpandedDrills({ [d.id]: true });
                              setSearchQuery(d.title);
                            }}
                            className="text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 shrink-0"
                          >
                            <Play size={10} /> View Drill
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

  // --- RENDER DRILLS TAB ---
  const renderDrills = () => (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-blue-600" size={22} />
          <h2 className="text-xl font-bold text-slate-800">Drills & Exercises</h2>
        </div>
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
        >
          <Plus size={15} /> Quick Add Drill
        </button>
      </div>

      <div className="space-y-3">
        {filteredDrills.length > 0 ? (
          filteredDrills.map(renderDrillCard)
        ) : (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 p-6">
            <p className="font-semibold">No drills match your filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting "All" tags.</p>
          </div>
        )}
      </div>
    </div>
  );

  // --- RENDER TOOLS TAB ---
  const renderTools = () => (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Interactive Floor Tools</h2>
        <span className="text-xs text-slate-500">Coach Toolkit</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Tool 1: Interactive Route Drawer */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Edit3 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">Route Drawer (Chalkboard)</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Snap a photo of the boulder wall on your phone, then draw colored beta lines, arrows, and hold numbers to explain routes.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsRouteDrawerOpen(true)}
            className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Play size={14} /> Open Route Drawer
          </button>
        </Card>

        {/* Tool 2: Floor Stopwatch & Interval Timer */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Timer size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Floor Stopwatch & Timers</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                AMRAP, For Time, EMOM, Tabata and MIX workouts, plus countdowns, intervals and stopwatch. Save presets, count rounds, track splits and use the gym display.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTimerConfig({ seconds: 3, title: 'Floor Exercise Timer' })}
            className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Play size={14} /> Open Timer
          </button>
        </Card>

        {/* Tool 3: Custom Daily Session Cart */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Custom Session Builder</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Assemble custom daily lesson plans (1 Warm-up, 2 Concepts, 3 Drills) on the fly and check off completed items.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSessionDrawerOpen(true)}
            className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
          >
            View Active Session ({sessionItems.length} items)
          </button>
        </Card>

        {/* Tool 4: Student Feedback QR Code */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <QrCode size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Course Feedback QR Code</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Generate a full-screen QR code on your phone for students to scan with their cameras at the end of Day 4.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFeedbackQrOpen(true)}
            className="w-full mt-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
          >
            Show Feedback QR
          </button>
        </Card>

        {/* Tool 5: Multi-Trainer Cloud Sync & Backup */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
              <Cloud size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Trainer Sync & Backup</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                1-click JSON export/import to share drills with other coaches via WhatsApp or sync to a shared Firebase/Supabase database.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
          >
            Sync / Export Data
          </button>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-800">
      {/* Top Search & Filter Bar */}
      {renderTopBar()}

      {/* Main Screen Body */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'concepts' && renderConcepts()}
        {activeTab === 'drills' && renderDrills()}
        {activeTab === 'students' && (
          <StudentManager students={students} onUpdateStudents={setStudents} />
        )}
        {activeTab === 'tools' && renderTools()}
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe z-40">
        <div className="flex justify-around items-center p-1.5 max-w-md mx-auto">
          <button 
            onClick={() => { setActiveTab('courses'); setSearchQuery(''); }}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              activeTab === 'courses' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen size={20} className="mb-0.5" />
            <span className="text-[11px]">Courses</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('concepts'); setSearchQuery(''); }}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              activeTab === 'concepts' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb size={20} className="mb-0.5" />
            <span className="text-[11px]">Concepts</span>
          </button>

          <button 
            onClick={() => { setActiveTab('drills'); setSearchQuery(''); }}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              activeTab === 'drills' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Dumbbell size={20} className="mb-0.5" />
            <span className="text-[11px]">Drills</span>
          </button>

          <button 
            onClick={() => { setActiveTab('students'); setSearchQuery(''); }}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              activeTab === 'students' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={20} className="mb-0.5" />
            <span className="text-[11px]">Students</span>
          </button>

          <button 
            onClick={() => { setActiveTab('tools'); setSearchQuery(''); }}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              activeTab === 'tools' ? 'text-purple-600 bg-purple-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 size={20} className="mb-0.5" />
            <span className="text-[11px]">Tools</span>
          </button>
        </div>
      </nav>

      {/* Floating Modals and Drawers */}
      {isRouteDrawerOpen && (
        <RouteDrawer onClose={() => setIsRouteDrawerOpen(false)} />
      )}

      {activeTimerConfig && (
        <DrillTimerModal
          initialSeconds={activeTimerConfig.seconds}
          drillTitle={activeTimerConfig.title}
          initialConfig={activeTimerConfig.config}
          onClose={() => setActiveTimerConfig(null)}
        />
      )}

      <SessionBuilderDrawer
        isOpen={isSessionDrawerOpen}
        sessionItems={sessionItems}
        onRemoveItem={removeFromSession}
        onToggleComplete={toggleSessionItemComplete}
        onClearSession={clearSession}
        onOpenTimer={(item) => setActiveTimerConfig({ seconds: item.timerSeconds || 3, title: item.title })}
        savedTemplates={savedTemplates}
        onSaveTemplate={saveSessionTemplate}
        onLoadTemplate={loadSessionTemplate}
        onDeleteTemplate={deleteSessionTemplate}
        onClose={() => setIsSessionDrawerOpen(false)}
      />

      {isQuickAddOpen && (
        <QuickAddDrillModal
          onSaveDrill={(newDrill) => setCustomDrills(prev => [newDrill, ...prev])}
          onClose={() => setIsQuickAddOpen(false)}
        />
      )}

      {isFeedbackQrOpen && (
        <FeedbackQrModal onClose={() => setIsFeedbackQrOpen(false)} />
      )}

      {isSyncModalOpen && (
        <SyncModal
          customDrills={customDrills}
          students={students}
          favorites={favorites}
          savedTemplates={savedTemplates}
          onImportData={(data) => {
            if (data.customDrills) setCustomDrills(data.customDrills);
            if (data.students) setStudents(data.students);
            if (data.favorites) setFavorites(data.favorites);
            if (data.savedTemplates) setSavedTemplates(data.savedTemplates);
          }}
          onClose={() => setIsSyncModalOpen(false)}
        />
      )}
    </div>
  );
}
