import { Volume2, Plus } from "lucide-react";
import { formatTime, completedIntervals } from "../utils/workoutTimer";
export default function TimerReadout({
  run,
  phase,
  phases,
  config,
  seconds,
  elapsed,
  duration,
  deathRound,
  onRound,
  onOpenCues,
  cueLabel,
}) {
  const done = run.status === "complete";
  const intervalMode = ["tabata", "interval", "emom"].includes(config.mode);
  const type = done ? "complete" : phase?.kind || "prepare";
  const name = done
    ? "Complete"
    : type === "prepare"
      ? "Get ready"
      : type === "rest"
        ? "Rest"
        : "Work";
  const remaining = Number.isFinite(duration)
    ? Math.max(0, 1 - elapsed / duration)
    : 1;
  const circumference = 2 * Math.PI * 126;
  const next = phases[run.index + 1];
  const up =
    done ||
    (phase?.kind !== "prepare" &&
      (config.display === "up" ||
        !Number.isFinite(duration) ||
        phase?.mode === "stopwatch"));
  return (
    <div className={`wt-readout wt-phase-${type}`}>
      <div className="wt-training-status">
        <span className="wt-live-state">
          <span />
          {done ? "Finished" : run.status === "paused" ? "Paused" : "Running"}
        </span>
        <p className="wt-cycle-position">
          {deathRound ? (
            <>
              <span className="wt-cycle-label">Round</span>{" "}
              <strong className="wt-cycle-number">{deathRound}</strong>
            </>
          ) : phase?.round ? (
            <>
              <span className="wt-cycle-label">Round</span>{" "}
              <strong className="wt-cycle-number">{phase.round}</strong>{" "}
              <span className="wt-cycle-total">of {phase.rounds}</span>
            </>
          ) : config.mode === "mix" ? (
            <>
              <span className="wt-cycle-label">Block</span>{" "}
              <strong className="wt-cycle-number">{phase?.block || 1}</strong>{" "}
              <span className="wt-cycle-total">of {config.blocks.length}</span>
            </>
          ) : (
            "Your rhythm"
          )}
        </p>
      </div>
      <div className="wt-clock-ring">
        <svg viewBox="0 0 280 280" aria-hidden="true">
          <circle className="wt-ring-track" cx="140" cy="140" r="126" />
          <circle
            className="wt-ring-progress"
            cx="140"
            cy="140"
            r="126"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - (done ? 1 : remaining))}
          />
        </svg>
        <div className="wt-ring-content">
          <p className="wt-phase-badge" aria-live="polite">
            {name}
          </p>
          <div
            className={`wt-clock ${formatTime(seconds, up).length > 5 ? "wt-clock-long" : ""}`}
            role="timer"
          >
            {formatTime(seconds, up)}
          </div>
          <p className="wt-clock-helper">
            {done
              ? "Session logged. Nice work."
              : deathRound
                ? `${phase.repsStart + (deathRound - 1) * phase.repsStep} reps this interval`
                : type === "rest"
                  ? "Breathe. Shake it out."
                  : type === "prepare"
                    ? "Find your position."
                    : "Stay connected."}
          </p>
        </div>
      </div>
      {phase?.label && !done && <p className="wt-block-name">{phase.label}</p>}
      {next && !done && (
        <div className={`wt-next-up ${next.kind === "rest" ? "is-rest" : ""}`}>
          <span className="wt-next-dot" />
          <span>
            <small>Next interval</small>
            <strong>
              {next.kind === "rest" ? "Rest" : next.label || "Work"}
            </strong>
          </span>
          <b>
            {Number.isFinite(next.duration)
              ? formatTime(next.duration)
              : "Open"}
          </b>
        </div>
      )}
      <div className="wt-telemetry">
        <div>
          <small>Elapsed time</small>
          <strong>{formatTime(run.elapsed, true)}</strong>
        </div>
        <div>
          <small>
            {done
              ? intervalMode
                ? "Intervals completed"
                : "Rounds / laps logged"
              : "Current cycle"}
          </small>
          <strong>
            {done
              ? intervalMode
                ? completedIntervals(run, phases)
                : run.countedRounds
              : `Set ${phase?.set || 1} of ${phase?.sets || 1}`}
          </strong>
        </div>
      </div>
      <div className="wt-readout-tools">
        <button onClick={onOpenCues}>
          <Volume2 size={16} />
          {cueLabel}
        </button>
        {!done && phase?.kind === "work" && (
          <button onClick={onRound}>
            <Plus size={16} />
            Round / lap · {run.countedRounds}
          </button>
        )}
      </div>
      {run.splits.length > 0 && (
        <p className="wt-meta wt-center">
          Last split {formatTime(run.splits.at(-1).split, true)}
        </p>
      )}
    </div>
  );
}
