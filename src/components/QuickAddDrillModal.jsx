import React, { useState } from 'react';
import { X, Plus, Check, Dumbbell, Tag } from 'lucide-react';
import { DEFAULT_TAGS } from '../data/initialData';

export default function QuickAddDrillModal({ onSaveDrill, onClose }) {
  const [title, setTitle] = useState('');
  const [focus, setFocus] = useState('Footwork & Positioning');
  const [selectedTags, setSelectedTags] = useState(['#footwork']);
  const [timerSeconds, setTimerSeconds] = useState('');
  const [setup, setSetup] = useState('');
  const [desc, setDesc] = useState('');
  const [executionText, setExecutionText] = useState('');
  const [mistakesText, setMistakesText] = useState('');

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const executionSteps = executionText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const mistakes = mistakesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newDrill = {
      id: 'custom_drill_' + Date.now(),
      title: title.trim(),
      focus: focus.trim() || 'Technique Exercise',
      tags: selectedTags,
      timerSeconds: timerSeconds ? Number(timerSeconds) : null,
      desc: desc.trim() || 'Custom floor drill created by trainer.',
      setup: setup.trim() || 'Any suitable boulder problem.',
      execution: executionSteps.length > 0 ? executionSteps : ['Execute the movement with control.'],
      mistakes: mistakes.length > 0 ? mistakes : ['Rushing the movement.'],
      isCustom: true
    };

    onSaveDrill(newDrill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-emerald-400" size={20} />
            <h3 className="font-bold text-base">Quick Add Drill Creator</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </header>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Drill Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Sloper Balance Hug"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Focus Skill</label>
              <input
                type="text"
                placeholder="e.g. Compression, Hip drive"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Timer (optional)</label>
              <input
                type="number"
                min="1"
                max="60"
                placeholder="e.g. 3 or 5 (sec)"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_TAGS.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    selectedTags.includes(tag) 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Short Description</label>
            <textarea
              rows={2}
              placeholder="What does this drill teach?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Environment Setup</label>
            <input
              type="text"
              placeholder="e.g. Slight overhang, big volume with small crimp"
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Execution Steps (one per line)</label>
            <textarea
              rows={3}
              placeholder="Step 1: Place big toe on edge&#10;Step 2: Twist hip into wall&#10;Step 3: Reach smoothly"
              value={executionText}
              onChange={(e) => setExecutionText(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Common Mistakes (one per line)</label>
            <textarea
              rows={2}
              placeholder="Jumping instead of pressing&#10;Looking away before toe is weighted"
              value={mistakesText}
              onChange={(e) => setMistakesText(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow"
            >
              <Check size={16} /> Save Drill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
