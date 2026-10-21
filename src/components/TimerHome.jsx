import {
  Timer,
  ArrowRight,
  Play,
  Clock3,
  Volume2,
  Bookmark,
  History,
} from "lucide-react";
import { TIMER_MODES, modeConfig } from "../data/timerModes";
import { readStorage, formatTime, MODE_LABELS } from "../utils/workoutTimer";
export default function TimerHome({ onOpen }) {
  const active = readStorage("boulder_timer_active_v2", null);
  const recent = readStorage("boulder_timer_log_v2", []).slice(0, 3);
  const openMode = (mode) =>
    onOpen({
      title: TIMER_MODES.find((m) => m.mode === mode).title,
      config: modeConfig(mode),
    });
  return (
    <div className="bt-page bt-timer-home">
      <div className="bt-page-heading">
        <p className="bt-eyebrow">Find your rhythm</p>
        <h1>One clock. Your pace.</h1>
        <p>Choose a format, set your times, and get moving.</p>
      </div>
      {active?.run && ["running", "paused"].includes(active.run.status) && (
        <button
          className="bt-continue"
          onClick={() => onOpen({ title: active.title })}
        >
          <Play size={22} />
          <span>
            <strong>Continue {active.title}</strong>
            <small>
              {active.run.status === "paused" ? "Paused" : "In progress"} ·{" "}
              {MODE_LABELS[active.config.mode]}
            </small>
          </span>
          <ArrowRight size={20} />
        </button>
      )}
      <div className="bt-section-title">
        <h2>Workout timers</h2>
        <button
          className="bt-icon-button"
          aria-label="Sound and voice cues"
          onClick={() =>
            onOpen({ title: "Timer cues", initialTab: "settings" })
          }
        >
          <Volume2 size={20} />
        </button>
      </div>
      <div className="bt-mode-grid">
        {TIMER_MODES.slice(0, 4).map((m) => (
          <button
            className={`bt-mode-card bt-accent-${m.color}`}
            onClick={() => openMode(m.mode)}
            key={m.mode}
          >
            <span className="bt-mode-symbol">
              <Timer size={22} />
              <ArrowRight size={16} />
            </span>
            <strong>{m.title}</strong>
            <span>{m.subtitle}</span>
            <small>{m.detail}</small>
          </button>
        ))}
      </div>
      <div className="bt-section-title">
        <h2>Make it your own</h2>
      </div>
      <div className="bt-mode-grid bt-secondary-modes">
        {TIMER_MODES.slice(4).map((m) => (
          <button
            className={`bt-mode-card bt-accent-${m.color}`}
            onClick={() => openMode(m.mode)}
            key={m.mode}
          >
            <strong>{m.title}</strong>
            <span>{m.subtitle}</span>
            <ArrowRight size={17} />
          </button>
        ))}
      </div>
      <div className="bt-quick-tools">
        <button
          onClick={() =>
            onOpen({ title: "Saved timers", initialTab: "presets" })
          }
        >
          <Bookmark size={19} />
          Saved timers
          <ArrowRight size={17} />
        </button>
        <button
          onClick={() =>
            onOpen({ title: "Workout history", initialTab: "log" })
          }
        >
          <History size={19} />
          History & backup
          <ArrowRight size={17} />
        </button>
      </div>
      {recent.length > 0 && (
        <section className="bt-recent">
          <div className="bt-section-title">
            <h2>Recently completed</h2>
          </div>
          {recent.map((w) => (
            <div key={w.id}>
              <span>
                <Clock3 size={16} />
                {w.title}
              </span>
              <strong>{formatTime(w.elapsed, true)}</strong>
            </div>
          ))}
        </section>
      )}
      <p className="bt-footnote">
        Distinct work, rest and finish sounds. Optional spoken cues keep your
        eyes on the wall.
      </p>
    </div>
  );
}
