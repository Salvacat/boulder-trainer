import { Volume2 } from "lucide-react";
import { cueMode } from "../utils/timerCues";
export default function TimerCueSettings({
  settings,
  onChange,
  voices,
  soundPacks,
  onPreview,
}) {
  const mode = cueMode(settings);
  return (
    <div className="wt-cue-settings">
      <div className="wt-section-heading">
        <p className="wt-eyebrow">Eyes on the wall</p>
        <h2>Hear what comes next.</h2>
        <p>A different signal for every part of your workout.</p>
      </div>
      <label className="wt-field">
        <span>Announcements</span>
        <select
          value={mode}
          onChange={(e) => {
            const next = e.target.value;
            onChange({
              voice: ["voice", "both"].includes(next),
              sound: ["sounds", "both"].includes(next)
                ? settings.sound === "Off"
                  ? "Chime"
                  : settings.sound
                : "Off",
            });
          }}
        >
          <option value="both">Voice + sounds</option>
          <option value="sounds">Sounds only</option>
          <option value="voice">Voice only</option>
          <option value="off">Silent</option>
        </select>
      </label>
      <label className="wt-volume">
        <span>
          Volume <strong>{settings.volume}%</strong>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          aria-label="Cue volume"
          value={settings.volume}
          onChange={(e) => onChange({ volume: Number(e.target.value) })}
        />
      </label>
      <div className="wt-cue-preview">
        {[
          ["work", "Work", "Rising two-tone start"],
          ["rest", "Rest", "Lower, descending tones"],
          ["repEnd", "Round complete", "Two crisp high beeps"],
          ["complete", "Workout complete", "Three-note finish chime"],
        ].map(([kind, label, description]) => (
          <button
            key={kind}
            disabled={mode === "off"}
            className={`wt-preview-${kind}`}
            onClick={() => onPreview(kind, label)}
            aria-label={`Preview ${label.toLowerCase()}`}
          >
            <Volume2 size={18} />
            <strong>{label}</strong>
            <small>{description}</small>
          </button>
        ))}
      </div>
      <div className="wt-cue-toggles">
        {[
          ["countdown", "Spoken countdown / last 3 seconds"],
          ["haptics", "Vibration"],
          ["halfway", "Halfway announcement"],
          ["minutes", "Minute announcements"],
        ].map(([key, label]) => (
          <label key={key} className="wt-toggle">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => onChange({ [key]: e.target.checked })}
            />
          </label>
        ))}
      </div>
      <details className="wt-block">
        <summary>Voice & sound preferences</summary>
        <label className="wt-field">
          <span>Voice on this device</span>
          <select
            value={settings.voiceURI}
            onChange={(e) => onChange({ voiceURI: e.target.value })}
          >
            <option value="">Device default</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} · {v.lang}
              </option>
            ))}
          </select>
        </label>
        <label className="wt-field">
          <span>Sound character</span>
          <select
            disabled={settings.sound === "Off"}
            value={settings.sound === "Off" ? "Chime" : settings.sound}
            onChange={(e) => onChange({ sound: e.target.value })}
          >
            {soundPacks.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <p className="wt-meta">
          Voice and vibration depend on your device. Keep the timer visible for
          reliable cues.
        </p>
      </details>
      <div className="wt-cue-toggles">
        {[
          ["awake", "Keep screen awake"],
          ["contrast", "Maximum visibility"],
        ].map(([key, label]) => (
          <label key={key} className="wt-toggle">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => onChange({ [key]: e.target.checked })}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
