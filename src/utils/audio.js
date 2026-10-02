// Web Audio API Synthesizer for floor timers (100% offline, zero audio assets needed)
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playBeep(freq = 880, duration = 0.12, type = 'sine') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Smooth envelope to avoid clicking sounds
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio beep error:', e);
  }
}

export function playTimerFinish() {
  try {
    // 3 short ascending chime tones
    playBeep(587.33, 0.1, 'triangle'); // D5
    setTimeout(() => playBeep(739.99, 0.1, 'triangle'), 120); // F#5
    setTimeout(() => playBeep(880.00, 0.25, 'triangle'), 240); // A5
    
    // Haptic feedback for mobile phones
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  } catch (e) {
    console.warn('Finish tone error:', e);
  }
}
