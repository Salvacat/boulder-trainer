import React, { useState } from 'react';
import { Play, Pause, Film, Link as LinkIcon, Check, Edit2 } from 'lucide-react';

export default function DemonstrationVisual({ visualType, customMediaUrl, onUpdateMediaUrl }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [inputUrl, setInputUrl] = useState(customMediaUrl || '');

  const handleSaveUrl = () => {
    if (onUpdateMediaUrl) {
      onUpdateMediaUrl(inputUrl.trim());
    }
    setIsEditingUrl(false);
  };

  // If a custom GIF or video URL is provided by the trainer:
  if (customMediaUrl) {
    const isVideo = customMediaUrl.endsWith('.mp4') || customMediaUrl.endsWith('.webm');
    return (
      <div className="my-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative">
        {isVideo ? (
          <video 
            src={customMediaUrl} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full max-h-56 object-contain"
          />
        ) : (
          <img 
            src={customMediaUrl} 
            alt="Drill demonstration" 
            className="w-full max-h-56 object-contain"
          />
        )}
        <button 
          onClick={() => setIsEditingUrl(true)}
          className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur flex items-center gap-1 hover:bg-black/80"
        >
          <Edit2 size={12} /> Edit Link
        </button>
      </div>
    );
  }

  // Built-in animated vector diagrams
  const renderDiagram = () => {
    switch (visualType) {
      case 'hover':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-36 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
            {/* Wall line & holds */}
            <line x1="20" y1="160" x2="300" y2="40" stroke="#334155" strokeWidth="6" strokeDasharray="4 4" />
            <circle cx="80" cy="130" r="10" fill="#10b981" />
            <circle cx="240" cy="65" r="12" fill="#3b82f6" />
            
            {/* Climber body */}
            <line x1="90" y1="140" x2="150" y2="110" stroke="#94a3b8" strokeWidth="4" />
            <line x1="150" y1="110" x2="160" y2="85" stroke="#cbd5e1" strokeWidth="5" />
            <circle cx="165" cy="70" r="9" fill="#f8fafc" />
            
            {/* Hover Hand with pulsing animation */}
            <g className={isPlaying ? "animate-pulse" : ""}>
              <circle cx="215" cy="75" r="8" fill="#f59e0b" />
              <circle cx="215" cy="75" r="16" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <text x="215" y="55" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
                Hover 3s!
              </text>
            </g>
            <text x="240" y="95" fill="#93c5fd" fontSize="10" textAnchor="middle">Target Hold</text>
            <text x="80" y="155" fill="#6ee7b7" fontSize="10" textAnchor="middle">Feet Base</text>
          </svg>
        );

      case 'turnin':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-36 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
            {/* Wall */}
            <rect x="250" y="10" width="10" height="160" fill="#475569" rx="2" />
            <circle cx="250" cy="50" r="8" fill="#3b82f6" />
            <circle cx="250" cy="140" r="8" fill="#10b981" />
            
            {/* Frontal (Faded bad example) */}
            <g opacity="0.3">
              <line x1="170" y1="140" x2="170" y2="70" stroke="#ef4444" strokeWidth="4" />
              <text x="140" y="100" fill="#ef4444" fontSize="10">Frontal (heavy)</text>
            </g>

            {/* Turned In Hip (Good example) */}
            <path d="M 235 140 Q 242 90 240 60" fill="none" stroke="#10b981" strokeWidth="5" />
            <circle cx="240" cy="95" r="8" fill="#34d399" />
            <line x1="240" y1="95" x2="250" y2="95" stroke="#fbbf24" strokeWidth="3" strokeDasharray="2 2" />
            
            <text x="175" y="35" fill="#34d399" fontSize="12" fontWeight="bold">Hip Turned Flush to Wall</text>
            <text x="180" y="165" fill="#94a3b8" fontSize="10">Longer reach • Arms straight</text>
          </svg>
        );

      case 'flagging':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-36 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
            {/* Center plumb line */}
            <line x1="160" y1="20" x2="160" y2="160" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
            {/* Holds */}
            <circle cx="160" cy="40" r="8" fill="#3b82f6" />
            <circle cx="150" cy="120" r="8" fill="#10b981" />
            
            {/* Body */}
            <circle cx="165" cy="65" r="9" fill="#f8fafc" />
            <line x1="160" y1="40" x2="165" y2="65" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="165" y1="65" x2="155" y2="105" stroke="#cbd5e1" strokeWidth="5" />
            
            {/* Weighted foot */}
            <line x1="155" y1="105" x2="150" y2="120" stroke="#10b981" strokeWidth="4" />
            
            {/* Flagged Leg (Counterweight) */}
            <g className={isPlaying ? "animate-pulse" : ""}>
              <line x1="155" y1="105" x2="245" y2="135" stroke="#f59e0b" strokeWidth="4" />
              <circle cx="245" cy="135" r="6" fill="#f59e0b" />
              <text x="245" y="155" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                Flagged Leg (Counterweight)
              </text>
            </g>
            <text x="90" y="80" fill="#38bdf8" fontSize="10">Prevents Barn-Door</text>
          </svg>
        );

      case 'footwork':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-36 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
            {/* Foothold */}
            <polygon points="120,130 220,130 200,165 140,165" fill="#475569" stroke="#64748b" strokeWidth="2" />
            <circle cx="160" cy="130" r="6" fill="#10b981" />
            
            {/* Climbing shoe big toe precision */}
            <path d="M 120 70 C 130 70, 155 100, 160 130 C 160 132, 175 132, 185 125 C 205 110, 220 80, 210 65" fill="#0284c7" opacity="0.85" />
            
            {/* Target reticle */}
            <circle cx="160" cy="130" r="14" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" className={isPlaying ? "animate-spin" : ""} />
            
            <text x="160" y="35" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              Big Toe on "Sweet Spot"
            </text>
            <text x="160" y="55" fill="#94a3b8" fontSize="10" textAnchor="middle">
              Zero Noise • No Second Bounce
            </text>
          </svg>
        );

      default:
        return (
          <div className="w-full h-32 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-slate-400 p-4 border border-slate-800">
            <Film size={28} className="text-slate-500 mb-2" />
            <p className="text-xs text-center">Movement Demonstration Visual</p>
            <p className="text-[11px] text-slate-500">Tap below to link an external demo GIF or video</p>
          </div>
        );
    }
  };

  return (
    <div className="my-3">
      <div className="relative">
        {renderDiagram()}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded text-white text-[11px]">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="hover:text-emerald-400 flex items-center gap-1"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <span className="text-slate-500">|</span>
          <button 
            onClick={() => setIsEditingUrl(!isEditingUrl)}
            className="hover:text-emerald-400 flex items-center gap-1"
          >
            <LinkIcon size={12} />
            <span>Add GIF/Video</span>
          </button>
        </div>
      </div>

      {isEditingUrl && (
        <div className="mt-2 p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <label className="block font-semibold text-slate-700 mb-1">
            Looping Video or GIF URL:
          </label>
          <div className="flex gap-2">
            <input 
              type="url"
              placeholder="https://example.com/demo.gif or .mp4"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button 
              onClick={handleSaveUrl}
              className="bg-emerald-600 text-white px-3 py-1.5 rounded font-medium flex items-center gap-1 hover:bg-emerald-700"
            >
              <Check size={14} /> Save
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Supports Giphy, Imgur, direct .gif, or .mp4 links.
          </p>
        </div>
      )}
    </div>
  );
}
