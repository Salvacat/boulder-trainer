// Web Audio API Synthesizer for floor timers (100% offline, zero audio assets needed)
import { CUE_PATTERNS } from "./timerCues.js";
let audioCtx = null;
const playingNotes = new Set();

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playBeep(
  freq = 880,
  duration = 0.12,
  type = "sine",
  volume = 1,
  delay = 0,
) {
  try {
    const ctx = getAudioContext();
    if (!ctx || volume <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    const start = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(freq, start);

    // Smooth envelope to avoid clicking sounds
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, 0.3 * Math.min(1, Math.max(0, volume))),
      start + 0.02,
    );
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    playingNotes.add(osc);
    osc.onended = () => {
      playingNotes.delete(osc);
      osc.disconnect();
      gain.disconnect();
    };
    osc.start(start);
    osc.stop(start + duration);
  } catch (e) {
    console.warn("Audio beep error:", e);
  }
}

export function cancelTimerAudio() {
  for (const note of playingNotes) {
    try {
      note.stop();
    } catch {
      /* Already stopped. */
    }
  }
  playingNotes.clear();
}

export function playTimerCue(
  kind,
  volume = 1,
  frequencyScale = 1,
  wave = "triangle",
  delay = 0,
) {
  for (const [frequency, duration, offset] of CUE_PATTERNS[kind] ||
    CUE_PATTERNS.work) {
    playBeep(
      frequency * frequencyScale,
      duration,
      wave,
      volume,
      offset + delay,
    );
  }
}

export function playTimerFinish() {
  try {
    // 3 short ascending chime tones
    playBeep(587.33, 0.1, "triangle"); // D5
    setTimeout(() => playBeep(739.99, 0.1, "triangle"), 120); // F#5
    setTimeout(() => playBeep(880.0, 0.25, "triangle"), 240); // A5

    // Haptic feedback for mobile phones
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  } catch (e) {
    console.warn("Finish tone error:", e);
  }
}
