import { useEffect, useRef, useState } from "react";
import {
  X,
  Check,
  Circle,
  Trash2,
  Save,
  FolderOpen,
  Play,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";
export default function SessionPlan({
  sessionItems,
  onRemoveItem,
  onToggleComplete,
  onClearSession,
  onOpenTimer,
  onMoveItem,
  savedTemplates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onBrowse,
  isOpen,
  onClose,
}) {
  const [name, setName] = useState(""),
    [saving, setSaving] = useState(false),
    [templates, setTemplates] = useState(false);
  const root = useRef(null);
  const completed = sessionItems.filter((i) => i.completed).length;
  useEffect(() => {
    if (!isOpen) return;
    const focused = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      focused?.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const keyboard = (e) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const elements = [
      ...root.current.querySelectorAll("button:not(:disabled),input"),
    ].filter((x) => x.getClientRects().length);
    const first = elements[0],
      last = elements.at(-1);
    if (
      e.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === root.current)
    ) {
      e.preventDefault();
      last?.focus();
    } else if (
      !e.shiftKey &&
      (document.activeElement === last ||
        document.activeElement === root.current)
    ) {
      e.preventDefault();
      first?.focus();
    }
  };
  return (
    <div className="bt-plan-overlay">
      <section
        className="bt-plan-drawer"
        ref={root}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="My session plan"
        onKeyDown={keyboard}
      >
        <header>
          <div>
            <p className="bt-eyebrow">Ready for the wall</p>
            <h2>My session plan</h2>
            <p>
              {completed} of {sessionItems.length} completed
            </p>
          </div>
          <button
            className="bt-icon-button"
            aria-label="Close session plan"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </header>
        <progress
          max={Math.max(1, sessionItems.length)}
          value={completed}
          aria-label="Session completion"
        />
        <div className="bt-plan-content">
          {!sessionItems.length && (
            <div className="bt-plan-empty">
              <Plus size={30} />
              <h3>Your next session starts here.</h3>
              <p>
                Choose a session, or add drills and concepts from the library.
              </p>
              {onBrowse && (
                <button className="bt-button bt-primary" onClick={onBrowse}>
                  Browse the library
                </button>
              )}
            </div>
          )}
          <ol className="bt-plan-list">
            {sessionItems.map((item, index) => (
              <li key={item.id} className={item.completed ? "is-complete" : ""}>
                <div className="bt-plan-item-main">
                  <button
                    className="bt-plan-check"
                    aria-label={`${item.completed ? "Mark incomplete" : "Mark complete"}: ${item.title}`}
                    aria-pressed={item.completed}
                    onClick={() => onToggleComplete(item.id)}
                  >
                    {item.completed ? (
                      <Check size={21} />
                    ) : (
                      <Circle size={21} />
                    )}
                  </button>
                  <div>
                    <span className="bt-eyebrow">
                      {String(index + 1).padStart(2, "0")} ·{" "}
                      {item.tags?.includes("#warmup")
                        ? "Warm-up"
                        : item.type === "concept"
                          ? "Concept"
                          : "Drill"}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.focus || item.category}</p>
                  </div>
                </div>
                <div className="bt-plan-item-actions">
                  <button
                    disabled={!index}
                    aria-label={`Move ${item.title} up`}
                    onClick={() => onMoveItem(item.id, -1)}
                  >
                    <ArrowUp size={17} />
                  </button>
                  <button
                    disabled={index === sessionItems.length - 1}
                    aria-label={`Move ${item.title} down`}
                    onClick={() => onMoveItem(item.id, 1)}
                  >
                    <ArrowDown size={17} />
                  </button>
                  <button
                    onClick={() => onOpenTimer(item)}
                    aria-label={`Time ${item.title}`}
                  >
                    <Play size={16} />
                    <span>Timer</span>
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
          {templates && (
            <section className="bt-plan-templates">
              <h3>Saved plans</h3>
              {!savedTemplates.length && <p>No saved plans yet.</p>}
              {savedTemplates.map((t) => (
                <div key={t.name}>
                  <span>
                    <strong>{t.name}</strong>
                    <small>{t.items.length} items</small>
                  </span>
                  <button
                    onClick={() => {
                      onLoadTemplate(t);
                      setTemplates(false);
                    }}
                  >
                    Load
                  </button>
                  <button
                    aria-label={`Delete ${t.name}`}
                    onClick={() => onDeleteTemplate(t.name)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </section>
          )}
        </div>
        <footer>
          {saving ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                onSaveTemplate(name.trim());
                setName("");
                setSaving(false);
              }}
            >
              <label className="bt-sr-only" htmlFor="plan-name">
                Plan name
              </label>
              <input
                id="plan-name"
                placeholder="Name this plan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
              <button type="submit" className="bt-button bt-primary">
                Save
              </button>
              <button
                type="button"
                aria-label="Cancel save"
                onClick={() => setSaving(false)}
              >
                <X size={20} />
              </button>
            </form>
          ) : (
            <>
              <div className="bt-plan-footer-actions">
                <button
                  disabled={!sessionItems.length}
                  onClick={() => setSaving(true)}
                >
                  <Save size={18} />
                  Save plan
                </button>
                <button onClick={() => setTemplates((v) => !v)}>
                  <FolderOpen size={18} />
                  Saved plans
                </button>
                {sessionItems.length > 0 && (
                  <button
                    aria-label="Clear session plan"
                    onClick={onClearSession}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {onBrowse && (
                <button className="bt-text-button" onClick={onBrowse}>
                  <Plus size={16} />
                  Add more from the library
                </button>
              )}
            </>
          )}
        </footer>
      </section>
    </div>
  );
}
