import { useState } from "react";
import {
  Clock3,
  Layers,
  Bookmark,
  ArrowRight,
  Plus,
  ChevronRight,
} from "lucide-react";
import { TRAINING_SESSIONS } from "../data/sessions";
export default function SessionLibrary({
  templates,
  bookmarks,
  onBookmark,
  onSelect,
  onLoadTemplate,
  onBuild,
  planCount,
  onOpenPlan,
}) {
  const [filter, setFilter] = useState("all");
  const sessions = TRAINING_SESSIONS.filter((s) =>
    filter === "technique"
      ? s.category === "Technique"
      : filter === "saved"
        ? bookmarks.includes(s.id)
        : true,
  );
  return (
    <div className="bt-page">
      <div className="bt-page-heading">
        <p className="bt-eyebrow">Your next session</p>
        <h1>Make every move count.</h1>
        <p>Structured drills. Deliberate pacing. Better climbing.</p>
      </div>
      {planCount > 0 && (
        <button className="bt-continue" onClick={onOpenPlan}>
          <span>
            <span className="bt-status-dot" /> Your plan is ready
            <strong>{planCount} items in your current session</strong>
          </span>
          <ArrowRight size={19} />
        </button>
      )}
      <div className="bt-filter-row" aria-label="Session filters">
        {[
          ["all", "All sessions"],
          ["technique", "Technique"],
          ["saved", "Saved"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={filter === id ? "is-active" : ""}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
            {id === "saved" && (
              <span>{templates.length + bookmarks.length}</span>
            )}
          </button>
        ))}
      </div>
      <div className="bt-session-grid">
        {sessions.map((s, i) => (
          <article
            className={`bt-session-card ${s.category === "Foundations" ? "bt-foundations" : ""}`}
            key={s.id}
          >
            <div className="bt-route-art" aria-hidden="true">
              <svg viewBox="0 0 160 180">
                <path
                  d="M140 10C20 30 150 110 40 170"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="4 5"
                />
                <circle cx="103" cy="36" r="6" fill="currentColor" />
                <path d="M102 95l8-4 5 11-11 5z" fill="currentColor" />
                <circle cx="60" cy="158" r="5" fill="currentColor" />
              </svg>
            </div>
            <p className="bt-eyebrow">
              <span className="bt-status-dot" />
              {s.category} · {s.level}
            </p>
            <h2>{s.title}</h2>
            <p className="bt-card-description">{s.description}</p>
            <div className="bt-session-meta">
              <span>
                <Clock3 size={16} />
                {s.minutes} min
              </span>
              <span>
                <Layers size={16} />
                {s.drillIds.length} drills
              </span>
            </div>
            <div className="bt-card-actions">
              <button
                className={
                  i === 0 && filter !== "saved"
                    ? "bt-button bt-primary"
                    : "bt-button bt-secondary"
                }
                onClick={() => onSelect(s.id)}
              >
                View session
                <ArrowRight size={18} />
              </button>
              <button
                className="bt-bookmark"
                aria-label={`${bookmarks.includes(s.id) ? "Unsave" : "Save"} ${s.title}`}
                aria-pressed={bookmarks.includes(s.id)}
                onClick={() => onBookmark(s.id)}
              >
                <Bookmark
                  size={20}
                  fill={bookmarks.includes(s.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
          </article>
        ))}
        {filter !== "technique" &&
          templates.map((t) => (
            <article className="bt-session-card bt-saved-card" key={t.name}>
              <p className="bt-eyebrow">Saved by you</p>
              <h2>{t.name}</h2>
              <div className="bt-session-meta">
                <span>
                  <Layers size={16} />
                  {t.items.length} items
                </span>
                <button
                  className="bt-text-button"
                  onClick={() => onLoadTemplate(t)}
                >
                  Open plan
                  <ArrowRight size={18} />
                </button>
              </div>
            </article>
          ))}
      </div>
      {filter === "saved" && !sessions.length && !templates.length && (
        <p className="bt-empty">
          Save a session or create a plan to find it here.
        </p>
      )}
      <button className="bt-build-row" onClick={onBuild}>
        <span className="bt-build-icon">
          <Plus size={25} />
        </span>
        <span>
          <strong>Build your own session</strong>
          <small>Choose drills from your library</small>
        </span>
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
