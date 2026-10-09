# 🧗‍♂️ Boulder Technique Trainer

A mobile-first bouldering and climbing technique trainer web app designed for quick access on your phone.

🔗 **Live App:** [https://salvacat.github.io/boulder-trainer/](https://salvacat.github.io/boulder-trainer/)

---

## 📱 How to Add to Your Phone Home Screen (Like an App / APK)

This app is configured as a Progressive Web App (PWA) with offline support, app icons, and standalone fullscreen display.

### 🍏 iPhone (iOS / Safari)
1. Open [https://salvacat.github.io/boulder-trainer/](https://salvacat.github.io/boulder-trainer/) in **Safari**.
2. Tap the **Share** button (the square with an arrow pointing up at the bottom).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add**. The Boulder Trainer icon will now appear on your home screen and open fullscreen without browser borders!

### 🤖 Android (Chrome)
1. Open [https://salvacat.github.io/boulder-trainer/](https://salvacat.github.io/boulder-trainer/) in **Chrome**.
2. Tap the **three dots menu** (⋮) in the top-right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Confirm by tapping **Install**. It now behaves like a native APK app!

---

## ✨ Features
- **9 October 2026 session:** Complete intermediate body-tension, heel-hook and toe-hook program, with 16 reusable drills, coaching cues, one-click session planning and an editable seven-block timer. The 15-minute warm-up and 30-minute finish follow the supplied program; other block durations are suggestions. Original program: [docs/body-tension-2026-10-09.md](docs/body-tension-2026-10-09.md).
- **Workout timers:** AMRAP, For Time (optional cap), EMOM (custom interval and Death By), Tabata, MIX, countdown, intervals and stopwatch. Includes intro countdown, rounds, sets, rest, count-up/down, skip, finish, manual round/lap splits, section repeats, block duplication/reordering and shared workout links.
- **Timer presets and log:** Device-local saved configurations, automatic completion logs, notes and images, CSV export, JSON backup/import. Import preserves unrelated existing entries. Preparation is excluded from workout scores. Up to 200 recent log entries are retained.
- **Gym display:** Large clock, gym/coach branding, logo tinting, workout text, adjustable text size, auto-scroll and high-visibility colors. Mirror the device screen or cast the browser tab to a TV.
- **Timer cues:** Seven original synthesized sound packs, volume/mute, browser-provided spoken voices, countdown/halfway/minute cues, vibration and screen wake lock where supported. Timestamp-based timing recovers after backgrounding, closing/reopening the timer or refreshing the app; browser sleep may suppress audio cues.
- **Curriculums:** Structured day-by-day lesson plans for Beginner, Intermediate, and Advanced technique courses.
- **Concept Library:** Deep dive into climbing physics, center of gravity (CoG), eindrehen, flagging, grip types, dynamic movements, and resting tactics.
- **Drill Library:** 22+ categorized drills (Ninja Feet, Carabiner Tail, Twist-Lock, Deadpointing, etc.) with detailed environment setups, execution steps, and common mistakes to watch for.
- **Fast Search:** Instant filter across all concepts, grips, and drills.
- **Offline Capable:** Service worker caches assets for instant loading even inside climbing gyms with weak reception.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build

# Check timer behavior
npm test
```

## Timer reference and platform limits

Timer behavior was researched against the official [SmartWOD Timer](https://smartwod.app/wod-timer), [MIX guide](https://smartwod.app/custom-workout-timer) and [Box Timer guide](https://smartwod.app/box-timer). This implementation uses original code and synthesized sounds, with the voices available on the current device. It does not include SmartWOD's proprietary sound/voice assets, native Apple Watch/Apple Health integration, direct Chromecast phone-remote control, or separate phone/TV audio routing. Those require native integrations beyond this GitHub Pages web app.

Workout data stays on the device. Export a timer backup before clearing browser data or moving to a new device. A running timer is restored when opening the timer again; opening an explicitly configured session or shared workout starts a new setup. Keep the timer visible for reliable sound cues. Timing catches up when returning from background sleep.
