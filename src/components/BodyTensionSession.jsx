import { useState } from 'react';
import {
  BODY_TENSION_SESSION as session,
  BODY_TENSION_DRILLS as drills,
} from "../data/bodyTension";

export default function BodyTensionSession({
  renderDrill,
  onAddSession,
  onStartTimer,
}) {
  const [isToday] = useState(() => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date()) === session.date);
  return (
    <section className="rounded-xl border border-emerald-200 bg-white overflow-hidden">
      <div className="bg-slate-900 p-4 text-white">
        <p className="text-xs font-bold text-emerald-400">
          {isToday ? "Today’s program" : "Session program"} · 9 October 2026 ·
          Intermediate
        </p>
        <h2 className="text-xl font-bold mt-2">{session.title}</h2>
        <p className="text-sm mt-2 text-slate-200">{session.idea}</p>
        <p className="text-xs text-slate-400 mt-2">
          Suggested 120-minute session. Warm-up (15 min) and finish (30 min)
          follow your plan; other block times are editable suggestions.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={onAddSession}
            className="bg-emerald-500 text-slate-950 font-bold rounded-lg px-3 py-2 text-xs"
          >
            Add full program to session
          </button>
          <button
            onClick={onStartTimer}
            className="bg-slate-700 rounded-lg px-3 py-2 text-xs font-semibold"
          >
            Time this session
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <details>
          <summary className="font-semibold text-sm cursor-pointer">
            Feel three useful chains
          </summary>
          <div className="space-y-2 mt-2">
            {session.chains.map(([name, text]) => (
              <p key={name} className="text-xs leading-relaxed">
                <strong>{name}:</strong> {text}
              </p>
            ))}
          </div>
        </details>
        <div className="bg-emerald-50 p-3 rounded-lg">
          <p className="font-bold text-xs mb-1">
            Repeat throughout the session
          </p>
          {session.cues.map((cue) => (
            <p key={cue} className="text-xs leading-relaxed">
              “{cue}”
            </p>
          ))}
        </div>
        {session.blocks.map((block, index) => (
          <details
            key={block.title}
            className="border-t border-slate-100 pt-3"
            open={index === 0}
          >
            <summary className="cursor-pointer text-sm font-bold">
              {index + 1}. {block.title}{" "}
              <span className="font-normal text-slate-500">
                · {block.minutes} min{block.suggested ? " suggested" : ""}
              </span>
            </summary>
            <div className="mt-3">
              {block.ids.map((id) =>
                renderDrill(drills.find((d) => d.id === `bt-${id}`)),
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
