import { useState, useEffect, useMemo, useRef } from "react";
import {
  Maximize,
  ChevronLeft,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
} from "lucide-react";
import { playBeep, playTimerCue, cancelTimerAudio } from "../utils/audio";
import { selectTimerCues, cueMode } from "../utils/timerCues";
import NumberField from "./NumberPicker";
import TimerReadout from "./TimerReadout";
import TimerCueSettings from "./TimerCueSettings";
import {
  DEFAULT_CONFIG,
  MODES,
  MODE_LABELS,
  normalizeConfig,
  buildPhases,
  newRun,
  advanceTo,
  nextPhase,
  roundSplit,
  formatTime,
  readStorage,
  writeStorage,
} from "../utils/workoutTimer";
import "./TimerDesign.css";

const K = {
  active: "boulder_timer_active_v2",
  presets: "boulder_timer_presets_v2",
  log: "boulder_timer_log_v2",
  settings: "boulder_timer_settings_v2",
};
const defaults = {
  sound: "Chime",
  volume: 60,
  voice: true,
  voiceURI: "",
  haptics: true,
  countdown: true,
  halfway: true,
  minutes: false,
  contrast: false,
  awake: true,
  box: "",
  coach: "",
  logo: "",
  notes: "",
  textSize: 18,
  autoScroll: false,
  tintLogo: false,
};
const sounds = {
  Chime: [880, "triangle"],
  Classic: [660, "sine"],
  Bell: [1320, "sine"],
  Digital: [990, "square"],
  Low: [330, "triangle"],
  Soft: [440, "sine"],
  Arcade: [1200, "sawtooth"],
};
function Fields({ value: c, onChange, inMix = false, advanced = false }) {
  const set = (key, value) => onChange({ ...c, [key]: value });
  const field = (key, label, min = 0, max = 86400) => (
    <NumberField
      key={key}
      label={label}
      value={c[key]}
      min={min}
      max={max}
      onChange={(v) => set(key, v)}
    />
  );
  return (
    <div className="wt-fields">
      {!advanced &&
        ["countdown", "amrap", "work", "rest"].includes(c.mode) &&
        field("duration", "Duration (seconds)", 1)}
      {!advanced &&
        c.mode === "fortime" &&
        field("timeCap", "Time cap (seconds; 0 = none)")}
      {!advanced && ["interval", "tabata"].includes(c.mode) && (
        <>
          {field("work", "Work (seconds)", 1)}
          {field("rest", "Rest (seconds)")}
        </>
      )}
      {c.mode === "emom" && (
        <>
          {!advanced && field("interval", "Interval (seconds)", 1)}
          {advanced && (
            <>
              <label className="wt-toggle">
                <input
                  type="checkbox"
                  checked={c.deathBy}
                  onChange={(e) => set("deathBy", e.target.checked)}
                />
                Death By (until you stop)
              </label>
              {c.deathBy && (
                <>
                  {field("repsStart", "Starting reps", 1, 100)}
                  {field("repsStep", "Add reps each interval", 1, 100)}
                </>
              )}
            </>
          )}
        </>
      )}
      {!advanced &&
        ["interval", "tabata", "emom"].includes(c.mode) &&
        !(c.mode === "emom" && c.deathBy) &&
        field("rounds", "Rounds / intervals", 1, 100)}
      {advanced && !["mix", "stopwatch", "work", "rest"].includes(c.mode) && (
        <>
          {field("sets", "Sets", 1, 100)}
          {c.sets > 1 && field("setRest", "Rest between sets (seconds)")}
        </>
      )}
      {advanced && !inMix && field("intro", "Intro countdown (seconds)", 0, 60)}
    </div>
  );
}
function download(name, data, type = "application/json") {
  const url = URL.createObjectURL(new Blob([data], { type })),
    link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function imageFile(file, callback, fail) {
  if (!file) return;
  if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
    fail("Choose an image smaller than 2 MB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.onerror = () => fail("Image could not be read.");
  reader.readAsDataURL(file);
}
export default function WorkoutTimer({
  initialSeconds = 3,
  drillTitle = "Floor Timer",
  initialConfig,
  onClose,
  embedded = false,
  initialTab = "timer",
}) {
  const [restored] = useState(() => {
    const s = readStorage(K.active, null);
    return !initialConfig &&
      s?.run &&
      ["running", "paused"].includes(s.run.status)
      ? s
      : null;
  });
  const [config, setConfig] = useState(() =>
    normalizeConfig(
      restored?.config ||
        initialConfig || { duration: initialSeconds, intro: 0 },
    ),
  );
  const [title, setTitle] = useState(restored?.title || drillTitle);
  const [run, setRun] = useState(() => restored?.run || newRun());
  const [settings, setSettings] = useState(() => ({
    ...defaults,
    ...readStorage(K.settings, {}),
  }));
  const [presets, setPresets] = useState(() => readStorage(K.presets, []));
  const [log, setLog] = useState(() => readStorage(K.log, []));
  const [tab, setTab] = useState(initialTab),
    [name, setName] = useState(""),
    [message, setMessage] = useState("");
  const [gym, setGym] = useState(false),
    [voices, setVoices] = useState([]);
  const root = useRef(null),
    text = useRef(null),
    previous = useRef(null);
  const latestSnapshot = useRef(null),
    lastPersisted = useRef(null);
  const compiled = useMemo(() => {
    try {
      return { phases: buildPhases(config), error: "" };
    } catch (e) {
      return { phases: [], error: e.message };
    }
  }, [config]);
  const { phases, error } = compiled,
    phase = phases[run.index],
    done = run.status === "complete",
    locked = ["running", "paused"].includes(run.status);
  const deathRound = phase?.deathBy
    ? Math.floor(run.phaseElapsed / phase.interval) + 1
    : null;
  const elapsed = phase?.deathBy
    ? run.phaseElapsed % phase.interval
    : run.phaseElapsed;
  const duration = phase?.deathBy ? phase.interval : phase?.duration;
  const up =
    config.display === "up" ||
    !Number.isFinite(duration) ||
    phase?.mode === "stopwatch";
  const seconds = done
    ? run.elapsed
    : up && phase?.kind !== "prepare"
      ? elapsed
      : Math.max(0, duration - elapsed);
  const total = phases.reduce((sum, p) => sum + p.duration, 0);
  const setting = (key, value) => setSettings((s) => ({ ...s, [key]: value }));
  const reset = () => {
    if (readStorage(K.active, null)?.run?.id === run.id) {
      try {
        localStorage.removeItem(K.active);
      } catch {
        /* Storage may be unavailable. */
      }
    }
    setRun(newRun());
    previous.current = null;
  };
  useEffect(() => {
    if (run.status !== "running") return;
    const tick = () => setRun((r) => advanceTo(r, Date.now(), phases));
    tick();
    const id = setInterval(tick, 100);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [run.status, phases]);
  useEffect(() => {
    latestSnapshot.current = { config, run, title };
    if (run.status === "ready") return;
    const prior = lastPersisted.current;
    if (
      !prior ||
      prior.config !== config ||
      prior.title !== title ||
      prior.id !== run.id ||
      prior.status !== run.status ||
      prior.index !== run.index ||
      prior.second !== Math.floor(run.phaseElapsed)
    ) {
      lastPersisted.current = {
        config,
        title,
        id: run.id,
        status: run.status,
        index: run.index,
        second: Math.floor(run.phaseElapsed),
      };
      if (!writeStorage(K.active, { config, run, title }))
        setMessage("Storage is full. Export a backup to keep your data.");
    }
  }, [config, run, title]);
  useEffect(() => {
    const flush = () => {
      const snapshot = latestSnapshot.current;
      if (snapshot && snapshot.run.status !== "ready")
        writeStorage(K.active, snapshot);
    };
    window.addEventListener("pagehide", flush);
    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
    };
  }, []);
  useEffect(() => {
    if (
      ![
        writeStorage(K.settings, settings),
        writeStorage(K.presets, presets),
        writeStorage(K.log, log),
      ].every(Boolean)
    )
      setMessage("Storage is full. Export a backup to keep your data.");
  }, [settings, presets, log]);
  useEffect(() => {
    if (done)
      setLog((items) =>
        items.some((x) => x.id === run.id)
          ? items
          : [
              {
                id: run.id,
                date: new Date().toISOString(),
                title,
                mode: config.mode,
                elapsed: run.elapsed,
                rounds: run.countedRounds,
                splits: run.splits,
                notes: "",
                image: "",
                config,
              },
              ...items,
            ].slice(0, 200),
      );
  }, [done, run, config, title]);
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const refresh = () => setVoices(window.speechSynthesis.getVoices());
    refresh();
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", refresh);
      window.speechSynthesis.cancel();
    };
  }, []);
  const signalEvents = (events) => {
    if (!events.length) return;
    cancelTimerAudio();
    const [frequency, wave] = sounds[settings.sound] || sounds.Chime;
    if (settings.sound !== "Off")
      events.forEach((event, index) =>
        playTimerCue(
          event.type,
          settings.volume / 100,
          frequency / 880,
          wave,
          index * 0.32,
        ),
      );
    if (settings.voice && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(
        events.map((e) => e.words).join(". "),
      );
      speech.voice =
        voices.find((v) => v.voiceURI === settings.voiceURI) || null;
      speech.volume = Math.min(1, Math.max(0, Number(settings.volume) / 100));
      speech.lang = speech.voice?.lang || "en-US";
      window.speechSynthesis.speak(speech);
    }
    if (settings.haptics && navigator.vibrate)
      navigator.vibrate(
        events.some((e) => e.type === "complete")
          ? [100, 50, 100, 50, 160]
          : events.some((e) => e.type === "rest")
            ? [70, 70, 70]
            : 90,
      );
  };
  useEffect(() => {
    const now = {
      id: run.id,
      index: run.index,
      status: run.status,
      deathRound,
      elapsed: Math.floor(elapsed),
      remaining: Number.isFinite(duration)
        ? Math.max(0, Math.ceil(duration - elapsed))
        : null,
      duration,
      kind: phase?.kind,
      label: phase?.label,
      round: deathRound || phase?.round,
      countedRounds: run.countedRounds,
    };
    const cues = selectTimerCues(previous.current, now, settings);
    previous.current = now;
    if (document.visibilityState === "visible") signalEvents(cues);
  });
  useEffect(() => {
    if (run.status === "paused" || run.status === "ready") {
      cancelTimerAudio();
      window.speechSynthesis?.cancel();
    }
    return () => {
      cancelTimerAudio();
      window.speechSynthesis?.cancel();
    };
  }, [run.status]);
  useEffect(() => {
    const focused = embedded && locked && tab === "timer";
    document.body.classList.toggle("bt-timer-focused", focused);
    return () => document.body.classList.remove("bt-timer-focused");
  }, [embedded, locked, tab]);
  useEffect(() => {
    let disposed = false,
      lock;
    const acquire = async () => {
      if (
        !lock &&
        settings.awake &&
        run.status === "running" &&
        document.visibilityState === "visible" &&
        navigator.wakeLock
      )
        try {
          const l = await navigator.wakeLock.request("screen");
          if (disposed) await l.release();
          else {
            lock = l;
            l.addEventListener("release", () => {
              lock = null;
            });
          }
        } catch {
          /* Browser may decline. */
        }
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", acquire);
      lock?.release().catch(() => {});
    };
  }, [settings.awake, run.status]);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (embedded) return;
    const focused = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    const key = (e) => {
      if (e.key === "Escape" && !document.fullscreenElement) closeRef.current();
      if (e.key !== "Tab") return;
      const all = [
          ...root.current.querySelectorAll(
            "button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary",
          ),
        ].filter((el) => el.getClientRects().length),
        first = all[0],
        last = all.at(-1);
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
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      focused?.focus();
    };
  }, [embedded]);
  useEffect(() => {
    if (!gym || !settings.autoScroll) return;
    const id = setInterval(() => {
      const el = text.current;
      if (el)
        el.scrollTop =
          el.scrollTop + el.clientHeight >= el.scrollHeight
            ? 0
            : el.scrollTop + 1;
    }, 120);
    return () => clearInterval(id);
  }, [gym, settings.autoScroll]);
  const startPause = () => {
    if (error) return;
    if (settings.sound !== "Off") playBeep(1, 0.03, "sine", 0);
    const now = Date.now();
    setRun((r) => {
      if (r.status === "running") {
        const advanced = advanceTo(r, now, phases);
        return {
          ...advanced,
          status: advanced.status === "complete" ? "complete" : "paused",
        };
      }
      return { ...(done ? newRun(now) : r), status: "running", updatedAt: now };
    });
  };
  const skip = () =>
    setRun((r) =>
      nextPhase(
        r.status === "running" ? advanceTo(r, Date.now(), phases) : r,
        phases,
      ),
    );
  const finish = () =>
    setRun((r) => ({
      ...(r.status === "running" ? advanceTo(r, Date.now(), phases) : r),
      status: "complete",
    }));
  const editBlock = (index, value) =>
    setConfig((c) => ({
      ...c,
      blocks: c.blocks.map((b, i) => (i === index ? value : b)),
    }));
  const move = (index, delta) =>
    setConfig((c) => {
      const blocks = [...c.blocks];
      [blocks[index], blocks[index + delta]] = [
        blocks[index + delta],
        blocks[index],
      ];
      return { ...c, blocks };
    });
  const addBlock = (mode) =>
    setConfig((c) => ({
      ...c,
      blocks: [
        ...c.blocks,
        mode === "repeat"
          ? {
              id: crypto.randomUUID(),
              mode,
              from: 1,
              to: c.blocks.length,
              repeat: 2,
            }
          : {
              ...DEFAULT_CONFIG,
              mode,
              label: MODE_LABELS[mode] || mode,
              intro: 0,
              id: crypto.randomUUID(),
            },
      ],
    }));
  const save = () => {
    if (!name.trim()) {
      setMessage("Enter a preset name.");
      return;
    }
    setPresets((p) => [
      { name: name.trim(), title, config: normalizeConfig(config) },
      ...p.filter((x) => x.name !== name.trim()),
    ]);
    setMessage("Preset saved on this device.");
  };
  const share = async () => {
    const url = `${location.origin}${location.pathname}#timer=${encodeURIComponent(JSON.stringify({ title, config: normalizeConfig(config) }))}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Workout link copied.");
    } catch {
      download(
        "boulder-timer-preset.json",
        JSON.stringify(
          { version: 2, presets: [{ name: name || title, title, config }] },
          null,
          2,
        ),
      );
      setMessage("Preset downloaded for sharing.");
    }
  };
  const backup = () =>
    download(
      "boulder-timer-backup.json",
      JSON.stringify({ version: 2, presets, log, settings }, null, 2),
    );
  const restore = async (file) => {
    if (!file) return;
    try {
      if (file.size > 15 * 1024 * 1024) throw new Error();
      const d = JSON.parse(await file.text());
      if (
        d.version !== 2 ||
        !Array.isArray(d.presets) ||
        !d.presets.every(
          (p) =>
            typeof p.name === "string" &&
            p.config &&
            MODES.includes(p.config.mode),
        )
      )
        throw new Error();
      const imported = d.presets.map((p) => ({
        name: p.name,
        title: typeof p.title === "string" ? p.title : p.name,
        config: normalizeConfig(p.config),
      }));
      imported.forEach((p) => buildPhases(p.config));
      if (
        d.log &&
        (!Array.isArray(d.log) ||
          !d.log.every(
            (x) =>
              typeof x.id === "string" &&
              Number.isFinite(x.elapsed) &&
              typeof x.title === "string" &&
              typeof x.date === "string" &&
              Array.isArray(x.splits) &&
              x.splits.every(
                (s) => Number.isFinite(s.split) && Number.isFinite(s.elapsed),
              ),
          ))
      )
        throw new Error();
      setPresets((p) =>
        [
          ...imported,
          ...p.filter((x) => !imported.some((y) => y.name === x.name)),
        ].slice(0, 200),
      );
      if (d.log)
        setLog((p) =>
          [
            ...d.log,
            ...p.filter((x) => !d.log.some((y) => y.id === x.id)),
          ].slice(0, 200),
        );
      if (d.settings)
        setSettings((s) => ({
          ...s,
          ...Object.fromEntries(
            Object.entries(d.settings).filter(
              ([k, v]) => k in defaults && typeof v === typeof defaults[k],
            ),
          ),
        }));
      setMessage(
        "Imported. Existing entries are kept; matching names and IDs are updated.",
      );
    } catch {
      setMessage("Not a valid Boulder Trainer timer backup or preset.");
    }
  };
  const fullscreen = async () => {
    if (gym) {
      setGym(false);
      if (document.fullscreenElement)
        await document.exitFullscreen().catch(() => {});
    } else {
      setGym(true);
      await root.current?.requestFullscreen?.().catch(() => {});
    }
  };
  const controls = (
    <div className="wt-action-area">
      <button className="wt-primary" disabled={!!error} onClick={startPause}>
        {run.status === "running" ? <Pause size={21} /> : <Play size={21} />}
        {run.status === "running"
          ? "Pause timer"
          : run.status === "paused"
            ? "Resume timer"
            : done
              ? "Start again"
              : "Start timer"}
      </button>
      {(locked || done) && (
        <div className="wt-secondary-actions">
          {locked && (
            <>
              <button onClick={skip}>
                <SkipForward size={18} />
                {phase?.mode === "fortime"
                  ? "Finish set"
                  : phase?.kind === "rest"
                    ? "Skip rest"
                    : "Next interval"}
              </button>
              <button onClick={finish}>Finish workout</button>
            </>
          )}
          <button onClick={reset} aria-label="Reset timer">
            <RotateCcw size={17} />
            Reset
          </button>
        </div>
      )}
    </div>
  );
  const cueLabels = {
    both: "Voice + sounds",
    sounds: "Sounds on",
    voice: "Voice on",
    off: "Silent",
  };
  const display = (
    <TimerReadout
      run={run}
      phase={phase}
      phases={phases}
      config={config}
      seconds={seconds}
      elapsed={elapsed}
      duration={duration}
      deathRound={deathRound}
      onRound={() =>
        setRun((r) =>
          roundSplit(
            r.status === "running" ? advanceTo(r, Date.now(), phases) : r,
          ),
        )
      }
      onOpenCues={() => setTab("settings")}
      cueLabel={cueLabels[cueMode(settings)]}
    />
  );
  const textField = (key, label, area = false) => (
    <label className="wt-field">
      <span>{label}</span>
      {area ? (
        <textarea
          value={settings[key]}
          rows={5}
          onChange={(e) => setting(key, e.target.value)}
        />
      ) : (
        <input
          value={settings[key]}
          onChange={(e) => setting(key, e.target.value)}
        />
      )}
    </label>
  );
  return (
    <div className={embedded ? "wt-inline" : "wt-overlay"}>
      <section
        ref={root}
        className={`wt-modal ${locked ? "wt-running" : done ? "wt-done" : "wt-ready"} ${gym ? "wt-gym" : ""} ${settings.contrast ? "wt-contrast" : ""}`}
        role={embedded ? "region" : "dialog"}
        aria-modal={embedded ? undefined : true}
        data-view={tab}
        aria-label="Workout timer"
        tabIndex={-1}
      >
        <header className="wt-header">
          <button
            className="wt-back"
            aria-label={embedded ? "Back to timers" : "Close timer"}
            onClick={() => {
              if (document.fullscreenElement)
                document.exitFullscreen().catch(() => {});
              onClose();
            }}
          >
            <ChevronLeft size={20} />
            <span>{embedded ? "Timers" : "Back"}</span>
          </button>
          <div className="wt-title">
            <strong>{MODE_LABELS[config.mode]}</strong>
            <small>{title}</small>
          </div>
          <div className="wt-header-tools">
            <button
              onClick={() => setTab(tab === "settings" ? "timer" : "settings")}
              aria-label="Sound and voice cues"
            >
              <Volume2 size={20} />
            </button>
            <button
              onClick={fullscreen}
              aria-label={gym ? "Exit gym display" : "Gym display"}
            >
              <Maximize size={18} />
            </button>
          </div>
        </header>
        {gym ? (
          <>
            <div className="wt-brand">
              {settings.logo && (
                <img
                  style={
                    settings.tintLogo
                      ? { filter: "brightness(0) invert(1)" }
                      : {}
                  }
                  src={settings.logo}
                  alt="Gym logo"
                />
              )}
              <strong>{settings.box || "Boulder Trainer"}</strong>
              <span>{settings.coach && `Coach: ${settings.coach}`}</span>
            </div>
            <div className="wt-gym-content">
              {settings.notes && (
                <div
                  ref={text}
                  className="wt-workout-text"
                  style={{ fontSize: settings.textSize }}
                >
                  {settings.notes}
                </div>
              )}
              {display}
            </div>
            {controls}
            <p className="wt-meta">
              Mirror your screen or cast this browser tab for TV use.
            </p>
          </>
        ) : (
          <>
            <nav className="wt-tabs">
              {["timer", "presets", "log", "settings"].map((t) => (
                <button
                  key={t}
                  aria-pressed={tab === t}
                  onClick={() => setTab(t)}
                  className={tab === t ? "wt-selected" : ""}
                >
                  {t === "log"
                    ? "History"
                    : t === "settings"
                      ? "Cues & display"
                      : t === "timer"
                        ? "Setup"
                        : "Saved"}
                </button>
              ))}
            </nav>
            {message && (
              <p role="status" className="wt-message">
                {message}
                <button
                  aria-label="Dismiss message"
                  onClick={() => setMessage("")}
                >
                  ×
                </button>
              </p>
            )}
            {tab === "timer" && (
              <>
                {locked || done ? (
                  <>
                    {display}
                    {controls}
                  </>
                ) : (
                  <div className="wt-section-heading">
                    <p className="wt-eyebrow">Set your rhythm</p>
                    <h2>{title}</h2>
                    <p>
                      {Number.isFinite(total)
                        ? formatTime(total) + " total, including preparation"
                        : "Open-ended · finish when you are ready"}
                    </p>
                  </div>
                )}
                {error && (
                  <p role="alert" className="wt-message">
                    {error}
                  </p>
                )}
                {!locked && !done && (
                  <fieldset className="wt-setup">
                    <legend>
                      Workout setup {locked ? "· Reset to edit" : ""}
                    </legend>
                    <Fields value={config} onChange={setConfig} />
                    <details className="wt-advanced">
                      <summary>Advanced options</summary>{" "}
                      <label className="wt-field">
                        <span>Workout name</span>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </label>
                      <Fields value={config} onChange={setConfig} advanced />
                      <label className="wt-field">
                        <span>Clock display</span>
                        <select
                          value={config.display}
                          onChange={(e) =>
                            setConfig((c) => ({
                              ...c,
                              display: e.target.value,
                            }))
                          }
                        >
                          <option value="down">Count down</option>
                          <option value="up">Count up</option>
                        </select>
                      </label>
                    </details>
                    {config.mode === "countdown" && (
                      <div className="wt-controls">
                        {[2, 3, 5, 10, 30, 60].map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setConfig((c) => ({ ...c, duration: s }));
                              reset();
                            }}
                          >
                            {s}s
                          </button>
                        ))}
                      </div>
                    )}
                    {config.mode === "mix" && (
                      <>
                        <NumberField
                          label="Repeat whole flow"
                          value={config.mixRepeats}
                          min={1}
                          max={100}
                          onChange={(v) =>
                            setConfig((c) => ({ ...c, mixRepeats: v }))
                          }
                        />
                        {config.blocks.map((b, i) => (
                          <details
                            className="wt-block"
                            key={b.id || i}
                            open={config.blocks.length <= 2}
                          >
                            <summary>
                              {i + 1}. {b.label || "Repeat section"}
                            </summary>
                            {b.mode === "repeat" ? (
                              <div className="wt-fields">
                                {[
                                  ["from", "From block"],
                                  ["to", "Through block"],
                                  ["repeat", "Total repetitions"],
                                ].map(([k, label]) => (
                                  <NumberField
                                    key={k}
                                    label={label}
                                    value={b[k]}
                                    min={1}
                                    max={k === "repeat" ? 100 : i}
                                    onChange={(v) =>
                                      editBlock(i, { ...b, [k]: v })
                                    }
                                  />
                                ))}
                              </div>
                            ) : (
                              <>
                                <label className="wt-field">
                                  <span>Block label</span>
                                  <input
                                    value={b.label}
                                    onChange={(e) =>
                                      editBlock(i, {
                                        ...b,
                                        label: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                                <Fields
                                  value={b}
                                  onChange={(v) => editBlock(i, v)}
                                  inMix
                                />
                                <details className="wt-advanced">
                                  <summary>Block options</summary>
                                  <Fields
                                    value={b}
                                    onChange={(v) => editBlock(i, v)}
                                    inMix
                                    advanced
                                  />
                                </details>
                              </>
                            )}
                            <div className="wt-controls">
                              <button
                                disabled={!i}
                                onClick={() => move(i, -1)}
                                aria-label={`Move block ${i + 1} up`}
                              >
                                ↑ Up
                              </button>
                              <button
                                disabled={i === config.blocks.length - 1}
                                onClick={() => move(i, 1)}
                                aria-label={`Move block ${i + 1} down`}
                              >
                                ↓ Down
                              </button>
                              <button
                                onClick={() =>
                                  setConfig((c) => ({
                                    ...c,
                                    blocks: c.blocks.flatMap((x, index) =>
                                      index === i
                                        ? [x, { ...x, id: crypto.randomUUID() }]
                                        : [x],
                                    ),
                                  }))
                                }
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={() =>
                                  setConfig((c) => ({
                                    ...c,
                                    blocks: c.blocks.filter(
                                      (_, index) => index !== i,
                                    ),
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </details>
                        ))}
                        <div className="wt-controls">
                          {[
                            "amrap",
                            "fortime",
                            "emom",
                            "tabata",
                            "work",
                            "rest",
                            "repeat",
                          ].map((m) => (
                            <button
                              key={m}
                              disabled={m === "repeat" && !config.blocks.length}
                              onClick={() => addBlock(m)}
                            >
                              + {MODE_LABELS[m] || m}
                            </button>
                          ))}
                        </div>
                        <p className="wt-meta">
                          Repeat markers replay a section of preceding blocks.
                          Uncapped For Time waits for “Finish set”.
                        </p>
                      </>
                    )}
                  </fieldset>
                )}
                {!locked && !done && controls}
                <details className="wt-block">
                  <summary>Show workout flow</summary>
                  <ol>
                    {phases.map((p, i) => (
                      <li
                        key={i}
                        className={run.index === i ? "wt-current" : ""}
                      >
                        {p.label}
                        {p.round ? ` · round ${p.round}` : ""}
                        {p.sets > 1 ? ` · set ${p.set}` : ""} ·{" "}
                        {formatTime(p.duration)}
                      </li>
                    ))}
                  </ol>
                </details>
              </>
            )}
            {tab === "presets" && (
              <div className="wt-section">
                <label className="wt-field">
                  <span>Preset name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <div className="wt-controls">
                  <button disabled={!!error} onClick={save}>
                    Save current setup
                  </button>
                  <button disabled={!!error} onClick={share}>
                    Share workout link
                  </button>
                </div>
                {!presets.length && <p>No saved timer presets yet.</p>}
                {presets.map((p) => (
                  <div key={p.name} className="wt-block">
                    <strong>{p.name}</strong> · {MODE_LABELS[p.config.mode]}
                    <div className="wt-controls">
                      <button
                        disabled={locked}
                        onClick={() => {
                          setConfig(normalizeConfig(p.config));
                          setTitle(p.title || p.name);
                          reset();
                          setTab("timer");
                        }}
                      >
                        Load
                      </button>
                      <button
                        onClick={() =>
                          setPresets((items) =>
                            items.filter((x) => x.name !== p.name),
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "log" && (
              <div className="wt-section">
                <div className="wt-controls">
                  <button
                    onClick={() => {
                      const csv = (v) =>
                        `"${String(v ?? "").replace(/"/g, '""')}"`;
                      download(
                        "boulder-workout-log.csv",
                        [
                          "Date,Workout,Mode,Seconds,Rounds,Notes,Round splits (seconds)",
                          ...log.map((x) =>
                            [
                              x.date,
                              x.title,
                              x.mode,
                              x.elapsed.toFixed(2),
                              x.rounds,
                              x.notes,
                              x.splits
                                .map((s) => s.split.toFixed(2))
                                .join("; "),
                            ]
                              .map(csv)
                              .join(","),
                          ),
                        ].join("\r\n"),
                        "text/csv",
                      );
                    }}
                  >
                    Export CSV
                  </button>
                  <button onClick={backup}>Backup everything</button>
                  <label className="wt-file">
                    Import backup / preset
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={(e) => {
                        restore(e.target.files[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                {!log.length && (
                  <p>Completed workouts appear here automatically.</p>
                )}
                {log.map((item) => (
                  <details className="wt-block" key={item.id}>
                    <summary>
                      {item.title} · {formatTime(item.elapsed, true)} ·{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </summary>
                    <p>
                      {MODE_LABELS[item.mode]} · {item.rounds} manually logged
                      rounds / laps
                    </p>
                    <label className="wt-field">
                      <span>Notes</span>
                      <textarea
                        value={item.notes || ""}
                        onChange={(e) =>
                          setLog((items) =>
                            items.map((x) =>
                              x.id === item.id
                                ? { ...x, notes: e.target.value }
                                : x,
                            ),
                          )
                        }
                      />
                    </label>
                    {item.image && (
                      <img
                        className="wt-log-image"
                        src={item.image}
                        alt="Workout attachment"
                      />
                    )}
                    <label className="wt-file">
                      Attach image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          imageFile(
                            e.target.files[0],
                            (image) =>
                              setLog((items) =>
                                items.map((x) =>
                                  x.id === item.id ? { ...x, image } : x,
                                ),
                              ),
                            setMessage,
                          )
                        }
                      />
                    </label>
                    {item.splits.map((s, i) => (
                      <p key={i}>
                        Round {s.round}: {formatTime(s.split, true)} · elapsed{" "}
                        {formatTime(s.elapsed, true)}
                      </p>
                    ))}
                    <div className="wt-controls">
                      {item.image && (
                        <button
                          onClick={() =>
                            setLog((items) =>
                              items.map((x) =>
                                x.id === item.id ? { ...x, image: "" } : x,
                              ),
                            )
                          }
                        >
                          Remove image
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setLog((items) =>
                            items.filter((x) => x.id !== item.id),
                          )
                        }
                      >
                        Delete entry
                      </button>
                    </div>
                  </details>
                ))}
              </div>
            )}
            {tab === "settings" && (
              <div className="wt-section">
                <TimerCueSettings
                  settings={settings}
                  onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
                  voices={voices}
                  soundPacks={Object.keys(sounds)}
                  onPreview={(type, words) => signalEvents([{ type, words }])}
                />
                <details className="wt-block wt-display-settings">
                  <summary>Gym display & branding</summary>
                  <h3>Gym display</h3>
                  {textField("box", "Gym / box name")}
                  {textField("coach", "Coach name")}
                  <label className="wt-file">
                    Upload gym logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        imageFile(
                          e.target.files[0],
                          (image) => setting("logo", image),
                          setMessage,
                        )
                      }
                    />
                  </label>
                  {settings.logo && (
                    <>
                      <img
                        className="wt-logo-preview"
                        src={settings.logo}
                        alt="Gym logo preview"
                      />
                      <button onClick={() => setting("logo", "")}>
                        Remove logo
                      </button>
                    </>
                  )}
                  <label className="wt-toggle">
                    <input
                      type="checkbox"
                      checked={settings.tintLogo}
                      onChange={(e) => setting("tintLogo", e.target.checked)}
                    />
                    Tint dark logo white
                  </label>
                  {textField("notes", "Workout text", true)}
                  <NumberField
                    label="Workout text size (px)"
                    value={settings.textSize}
                    min={12}
                    max={64}
                    onChange={(v) =>
                      setting("textSize", Math.min(64, Math.max(12, v)))
                    }
                  />
                  <label className="wt-toggle">
                    <input
                      type="checkbox"
                      checked={settings.autoScroll}
                      onChange={(e) => setting("autoScroll", e.target.checked)}
                    />
                    Slow auto-scroll
                  </label>
                  <p className="wt-meta">
                    Mirror your screen or cast this browser tab to show the
                    timer on a TV. Timers recover elapsed time after
                    backgrounding. A locked screen may silence cues.
                  </p>
                </details>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
