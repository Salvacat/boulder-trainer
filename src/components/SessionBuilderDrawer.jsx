import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Trash2, Save, FolderOpen, Play, Dumbbell, Lightbulb, Check, Plus } from 'lucide-react';

export default function SessionBuilderDrawer({ 
  sessionItems, 
  onRemoveItem, 
  onToggleComplete, 
  onClearSession,
  onOpenTimer,
  savedTemplates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  isOpen, 
  onClose 
}) {
  const [templateName, setTemplateName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);

  if (!isOpen) return null;

  const warmups = sessionItems.filter(i => i.type === 'warmup' || (i.tags && i.tags.includes('#warmup')));
  const concepts = sessionItems.filter(i => i.type === 'concept');
  const drills = sessionItems.filter(i => i.type === 'drill' && (!i.tags || !i.tags.includes('#warmup')));

  const completedCount = sessionItems.filter(i => i.completed).length;

  const handleSave = () => {
    if (!templateName.trim()) return;
    onSaveTemplate(templateName.trim());
    setTemplateName('');
    setIsSaving(false);
  };

  const renderItem = (item) => (
    <div 
      key={item.id} 
      className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${item.completed ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm'}`}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <button 
          onClick={() => onToggleComplete(item.id)}
          className={`shrink-0 ${item.completed ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-400'}`}
        >
          {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
        <div className="min-w-0">
          <h4 className={`text-sm font-semibold truncate ${item.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
            {item.title}
          </h4>
          <span className="text-[11px] text-slate-500">
            {item.category || item.focus || (item.type === 'concept' ? 'Concept' : 'Drill')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {item.timerSeconds && (
          <button
            onClick={() => onOpenTimer(item)}
            className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100"
            title="Open Timer"
          >
            <Play size={14} />
          </button>
        )}
        <button
          onClick={() => onRemoveItem(item.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded"
          title="Remove from session"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-50 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <header className="p-4 bg-slate-900 text-white flex items-center justify-between shadow">
          <div>
            <h2 className="font-bold text-lg">Custom Session Builder</h2>
            <p className="text-xs text-slate-400">
              {completedCount}/{sessionItems.length} items completed today
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X size={22} />
          </button>
        </header>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {sessionItems.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Dumbbell size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700">Your session cart is empty</h3>
              <p className="text-xs max-w-xs mx-auto mt-1 text-slate-500">
                Browse through Concepts and Drills and tap "+ Add to Session" to build your custom daily lesson plan.
              </p>
            </div>
          ) : (
            <>
              {/* Warm-up Section */}
              {warmups.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    🔥 Warm-Up ({warmups.length})
                  </h3>
                  <div className="space-y-2">
                    {warmups.map(renderItem)}
                  </div>
                </div>
              )}

              {/* Concepts Section */}
              {concepts.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Lightbulb size={14} /> Concepts ({concepts.length})
                  </h3>
                  <div className="space-y-2">
                    {concepts.map(renderItem)}
                  </div>
                </div>
              )}

              {/* Drills Section */}
              {drills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Dumbbell size={14} /> Drills & Exercises ({drills.length})
                  </h3>
                  <div className="space-y-2">
                    {drills.map(renderItem)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Saved Templates Section */}
          {showSavedList && (
            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Saved Class Templates</h4>
              {savedTemplates.length === 0 ? (
                <p className="text-xs text-slate-400">No saved templates yet.</p>
              ) : (
                <div className="space-y-2">
                  {savedTemplates.map(tmpl => (
                    <div key={tmpl.name} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border">
                      <div>
                        <span className="font-semibold text-slate-800">{tmpl.name}</span>
                        <span className="text-slate-400 ml-2">({tmpl.items.length} items)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { onLoadTemplate(tmpl); setShowSavedList(false); }}
                          className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-medium"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => onDeleteTemplate(tmpl.name)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <footer className="p-4 bg-white border-t border-slate-200 space-y-2 pb-safe">
          {isSaving ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Template name (e.g., Footwork Clinic)"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 flex items-center gap-1"
              >
                <Check size={14} /> Save
              </button>
              <button
                onClick={() => setIsSaving(false)}
                className="px-2 py-2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsSaving(true)}
                disabled={sessionItems.length === 0}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Save size={14} /> Save Template
              </button>
              <button
                onClick={() => setShowSavedList(!showSavedList)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <FolderOpen size={14} /> Templates ({savedTemplates.length})
              </button>
              {sessionItems.length > 0 && (
                <button
                  onClick={onClearSession}
                  className="px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-semibold"
                  title="Clear Session"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
