import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX, Timer, Flame, CheckCircle } from 'lucide-react';
import { playBeep, playTimerFinish } from '../utils/audio';

export default function DrillTimerModal({ initialSeconds = 3, drillTitle = 'Floor Drill', onClose }) {
  const [targetSeconds, setTargetSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('countdown'); // 'countdown', 'interval', 'stopwatch'
  const [isMuted, setIsMuted] = useState(false);
  
  // Interval mode state
  const [intervalReps, setIntervalReps] = useState(5);
  const [currentRep, setCurrentRep] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true); // work vs rest

  const timerRef = useRef(null);

  // Countdown timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (mode === 'stopwatch') {
            return prev + 1;
          }

          if (prev <= 1) {
            // Timer expired for this phase
            if (!isMuted) playTimerFinish();

            if (mode === 'interval') {
              if (isWorkPhase) {
                // Switch to Rest phase
                setIsWorkPhase(false);
                return targetSeconds; // rest for same duration or 3s
              } else {
                // Completed one full rep
                if (currentRep < intervalReps) {
                  setCurrentRep(r => r + 1);
                  setIsWorkPhase(true);
                  return targetSeconds;
                } else {
                  // Finished all reps!
                  setIsRunning(false);
                  return 0;
                }
              }
            } else {
              setIsRunning(false);
              return 0;
            }
          }

          // Count down beeps for last 3 seconds
          if (prev <= 4 && !isMuted) {
            playBeep(440, 0.08, 'sine');
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, isWorkPhase, currentRep, intervalReps, targetSeconds, isMuted]);

  const handleStartPause = () => {
    if (timeLeft === 0 && mode !== 'stopwatch') {
      setTimeLeft(targetSeconds);
      setCurrentRep(1);
      setIsWorkPhase(true);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'stopwatch' ? 0 : targetSeconds);
    setCurrentRep(1);
    setIsWorkPhase(true);
  };

  const progressPct = mode === 'stopwatch' 
    ? 100 
    : Math.max(0, Math.min(100, ((targetSeconds - timeLeft) / targetSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 text-white shadow-2xl relative flex flex-col items-center">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="text-emerald-400" size={20} />
            <h3 className="font-bold text-sm text-slate-200 truncate max-w-[200px]">
              {drillTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white p-1"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-800 p-1 rounded-xl w-full mb-6 text-xs">
          <button
            onClick={() => { setMode('countdown'); handleReset(); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${mode === 'countdown' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Countdown
          </button>
          <button
            onClick={() => { setMode('interval'); handleReset(); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${mode === 'interval' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Intervals
          </button>
          <button
            onClick={() => { setMode('stopwatch'); handleReset(); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${mode === 'stopwatch' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Stopwatch
          </button>
        </div>

        {/* Status in Interval Mode */}
        {mode === 'interval' && (
          <div className="mb-2 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 bg-slate-800">
            <Flame size={14} className={isWorkPhase ? "text-amber-400" : "text-blue-400"} />
            <span className={isWorkPhase ? "text-amber-400" : "text-blue-400"}>
              {isWorkPhase ? 'HOLD / WORK' : 'SHAKE / REST'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Rep {currentRep}/{intervalReps}</span>
          </div>
        )}

        {/* Big Circular Display */}
        <div className="relative w-48 h-48 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#334155"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={mode === 'interval' && !isWorkPhase ? "#38bdf8" : "#10b981"}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progressPct / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-black tracking-tight text-white font-mono">
              {timeLeft}
              <span className="text-lg font-normal text-slate-400 ml-0.5">s</span>
            </span>
            <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
              {isRunning ? 'Running' : (timeLeft === 0 ? 'Done!' : 'Ready')}
            </span>
          </div>
        </div>

        {/* Quick Duration Buttons (in countdown mode) */}
        {mode === 'countdown' && (
          <div className="flex gap-2 my-4">
            {[3, 5, 10, 30].map(s => (
              <button
                key={s}
                onClick={() => { setTargetSeconds(s); setTimeLeft(s); setIsRunning(false); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${targetSeconds === s ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                {s}s
              </button>
            ))}
          </div>
        )}

        {/* Big Control Buttons */}
        <div className="flex items-center gap-4 w-full mt-4">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <RotateCcw size={18} /> Reset
          </button>
          <button
            onClick={handleStartPause}
            className={`flex-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'}`}
          >
            {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
          </button>
        </div>
      </div>
    </div>
  );
}
