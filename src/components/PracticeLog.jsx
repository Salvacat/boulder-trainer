import { useRef, useState } from "react";
import { MOVEMENT_TOPICS } from "../data/advancedTraining.js";
import { localDate } from "../utils/practiceLog.js";

const blank = (topicId, role) => ({
  topicId: topicId || MOVEMENT_TOPICS[0].id,
  date: localDate(),
  who: "",
  role,
  status: "tested",
  observation: "",
  hypothesis: "",
  experiment: "",
  result: "",
  next: "",
});
export default function PracticeLog({
  entries,
  onChange,
  topicId,
  role = "coach",
  onOpenTopic,
  onBackup,
}) {
  const [draft, setDraft] = useState(() => blank(topicId, role));
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const [removed, setRemoved] = useState(null);
  const [filter, setFilter] = useState("all");
  const [who, setWho] = useState("");
  const form = useRef(null);
  const commit = (next) => {
    const saved = onChange(next);
    if (saved === false) {
      setNotice(
        "Could not save to browser storage. Keep this form open or export a backup.",
      );
      return false;
    }
    return true;
  };
  const update = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const records = entries
    .filter(
      (e) =>
        (!topicId || e.topicId === topicId) &&
        (filter === "all" || e.status === filter) &&
        e.who.toLowerCase().includes(who.toLowerCase()),
    )
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  const text = (key, label, required = false) => (
    <label className="bt-log-field" key={key}>
      {label}
      <textarea
        required={required}
        maxLength={3000}
        rows={2}
        value={draft[key]}
        onChange={(e) => update(key, e.target.value)}
      />
    </label>
  );
  return (
    <section className="bt-practice-log">
      <div className="bt-atlas-section-heading">
        <div>
          <p className="bt-eyebrow">A useful next attempt</p>
          <h2>{topicId ? "Keep a practice note" : "Your practice log"}</h2>
        </div>
        <button className="bt-button bt-secondary" onClick={onBackup}>
          Backup
        </button>
      </div>
      <p className="bt-footnote">
        Saved in this browser. Keep an observation, a test and a next step for
        yourself or a participant. Export a backup to keep a separate copy.
      </p>
      <form
        ref={form}
        className="bt-log-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.observation.trim()) return;
          const item = {
            ...draft,
            role: editing ? draft.role : role,
            id: editing || crypto.randomUUID(),
          };
          if (
            !commit((current) =>
              editing
                ? current.map((x) => (x.id === editing ? item : x))
                : [item, ...current],
            )
          )
            return;
          setDraft(blank(topicId, role));
          setEditing(null);
          setNotice("Practice note saved.");
        }}
      >
        <div className="bt-log-grid">
          {!topicId && (
            <label className="bt-log-field">
              Movement topic
              <select
                value={draft.topicId}
                onChange={(e) => update("topicId", e.target.value)}
              >
                {MOVEMENT_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="bt-log-field">
            Date
            <input
              required
              type="date"
              value={draft.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>
          <label className="bt-log-field">
            For
            <input
              maxLength={100}
              placeholder="Me or participant initials"
              value={draft.who}
              onChange={(e) => update("who", e.target.value)}
            />
          </label>
          <label className="bt-log-field">
            Next action
            <select
              value={draft.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="planned">Plan to test</option>
              <option value="tested">Tested</option>
              <option value="revisit">Revisit next session</option>
            </select>
          </label>
        </div>
        {text(
          "observation",
          role === "climber"
            ? "What did you notice?"
            : "Observation · what actually happened?",
          true,
        )}
        {text("experiment", "What did you try, or want to test?")}
        {text("result", "What changed?")}
        <details>
          <summary>Hypothesis & next-session check</summary>
          {text(
            "hypothesis",
            "Possible explanation · keep it separate from the observation",
          )}
          {text("next", "What will you check next time?")}
        </details>
        <div className="bt-card-actions">
          <button className="bt-button bt-primary" type="submit">
            {editing ? "Save changes" : "Save practice note"}
          </button>
          {editing && (
            <button
              className="bt-button bt-secondary"
              type="button"
              onClick={() => {
                setEditing(null);
                setDraft(blank(topicId, role));
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
      <p role="status" className="bt-log-notice">
        {notice}
      </p>
      {removed && (
        <button
          className="bt-source-link"
          onClick={() => {
            if (!commit((current) => [removed, ...current])) return;
            setRemoved(null);
            setNotice("Note restored.");
          }}
        >
          Undo removal
        </button>
      )}
      <div className="bt-log-filters">
        <label className="bt-log-field">
          Show
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All notes</option>
            <option value="planned">Plan to test</option>
            <option value="tested">Tested</option>
            <option value="revisit">Revisit next session</option>
          </select>
        </label>
        <label className="bt-log-field">
          Find person
          <input
            type="search"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            placeholder="Name or initials"
          />
        </label>
      </div>
      <div className="bt-log-records">
        {records.length === 0 ? (
          <p className="bt-footnote">No notes in this view yet.</p>
        ) : (
          records.map((entry) => {
            const topic = MOVEMENT_TOPICS.find((t) => t.id === entry.topicId);
            return (
              <article className="bt-log-record" key={entry.id}>
                <p className="bt-eyebrow">
                  {entry.date} · {entry.who || "Me"} ·{" "}
                  {entry.status === "revisit"
                    ? "Revisit next session"
                    : entry.status === "planned"
                      ? "Plan to test"
                      : "Tested"}
                </p>
                {topic && !topicId && (
                  <button
                    className="bt-source-link"
                    onClick={() => onOpenTopic?.(entry.topicId)}
                  >
                    {topic.title} →
                  </button>
                )}
                <p>
                  <strong>Observed:</strong> {entry.observation}
                </p>
                {entry.experiment && (
                  <p>
                    <strong>Test:</strong> {entry.experiment}
                  </p>
                )}
                {entry.result && (
                  <p>
                    <strong>Result:</strong> {entry.result}
                  </p>
                )}
                {(entry.hypothesis || entry.next) && (
                  <details>
                    <summary>Explanation & next step</summary>
                    {entry.hypothesis && <p>{entry.hypothesis}</p>}
                    {entry.next && (
                      <p>
                        <strong>Next:</strong> {entry.next}
                      </p>
                    )}
                  </details>
                )}
                <div className="bt-card-actions">
                  <button
                    className="bt-button bt-secondary"
                    onClick={() => {
                      setDraft(entry);
                      setEditing(entry.id);
                      setNotice("Editing note above.");
                      form.current?.scrollIntoView({
                        behavior: "auto",
                        block: "start",
                      });
                      form.current?.querySelector("textarea")?.focus();
                    }}
                  >
                    Edit note
                  </button>
                  <button
                    className="bt-button bt-secondary"
                    onClick={() => {
                      if (
                        !commit((current) =>
                          current.filter((x) => x.id !== entry.id),
                        )
                      )
                        return;
                      setRemoved(entry);
                      setNotice("Note removed. Undo is available.");
                    }}
                  >
                    Remove note
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
