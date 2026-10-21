# Boulder Trainer — Kinetic Chalk

Stitch project: 11514012098590137871. Screens: Sessions Home (44ca6de09bc14e9483c7d3f881f981b2), Active Timer (2287359667924d87a479620597164541).

---

name: Kinetic Chalk
colors:
surface: '#0e1511'
surface-dim: '#0e1511'
surface-bright: '#343b36'
surface-container-lowest: '#09100c'
surface-container-low: '#161d19'
surface-container: '#1a211d'
surface-container-high: '#242c27'
surface-container-highest: '#2f3632'
on-surface: '#dde4dd'
on-surface-variant: '#c5c9b2'
inverse-surface: '#dde4dd'
inverse-on-surface: '#2b322d'
outline: '#8f937e'
outline-variant: '#454937'
surface-tint: '#b1d34e'
primary: '#ffffff'
on-primary: '#283500'
primary-container: '#ccf067'
on-primary-container: '#556d00'
inverse-primary: '#506600'
secondary: '#ffb693'
on-secondary: '#562000'
secondary-container: '#773208'
on-secondary-container: '#fe9d6c'
tertiary: '#ffffff'
on-tertiary: '#003735'
tertiary-container: '#96f2ed'
on-tertiary-container: '#00716d'
error: '#ffb4ab'
on-error: '#690005'
error-container: '#93000a'
on-error-container: '#ffdad6'
primary-fixed: '#ccf067'
primary-fixed-dim: '#b1d34e'
on-primary-fixed: '#161f00'
on-primary-fixed-variant: '#3b4d00'
secondary-fixed: '#ffdbcc'
secondary-fixed-dim: '#ffb693'
on-secondary-fixed: '#351000'
on-secondary-fixed-variant: '#773208'
tertiary-fixed: '#96f2ed'
tertiary-fixed-dim: '#7ad6d1'
on-tertiary-fixed: '#00201f'
on-tertiary-fixed-variant: '#00504d'
background: '#0e1511'
on-background: '#dde4dd'
surface-variant: '#2f3632'
typography:
headline-xl:
fontFamily: Space Grotesk
fontSize: 44px
fontWeight: '700'
lineHeight: 48px
letterSpacing: -0.03em
headline-xl-mobile:
fontFamily: Space Grotesk
fontSize: 36px
fontWeight: '700'
lineHeight: 40px
letterSpacing: -0.02em
headline-lg:
fontFamily: Space Grotesk
fontSize: 30px
fontWeight: '700'
lineHeight: 36px
letterSpacing: -0.02em
headline-md:
fontFamily: Space Grotesk
fontSize: 20px
fontWeight: '600'
lineHeight: 26px
letterSpacing: -0.01em
headline-sm:
fontFamily: Space Grotesk
fontSize: 17px
fontWeight: '600'
lineHeight: 22px
letterSpacing: 0em
body-lg:
fontFamily: DM Sans
fontSize: 17px
fontWeight: '400'
lineHeight: 24px
body-md:
fontFamily: DM Sans
fontSize: 15px
fontWeight: '400'
lineHeight: 22px
body-sm:
fontFamily: DM Sans
fontSize: 13px
fontWeight: '400'
lineHeight: 18px
label-md:
fontFamily: DM Sans
fontSize: 12px
fontWeight: '600'
lineHeight: 16px
letterSpacing: 0.08em
label-sm:
fontFamily: DM Sans
fontSize: 10px
fontWeight: '700'
lineHeight: 14px
letterSpacing: 0.1em
rounded:
sm: 0.25rem
DEFAULT: 0.5rem
md: 0.75rem
lg: 1rem
xl: 1.5rem
full: 9999px
spacing:
gutter: 1rem
gutter-mobile: 0.75rem
margin: 1.25rem
margin-mobile: 1rem
space-xs: 0.25rem
space-sm: 0.5rem
space-md: 0.75rem
space-lg: 1.25rem
space-xl: 2rem
---

## Brand & Style

The design system is engineered for modern bouldering and sport climbing athletes who demand immediate, high-legibility training telemetry under physical duress and chalked-finger conditions. Inspired by rugged industrial timers and focused analog athletic tools, it rejects decorative skeuomorphism, ambient glow, and translucent glass layers in favor of a raw, editorial, tactile utility.

The aesthetic fuses stark, dark-canvas minimalism with precise mechanical instrumentation:

- **Atmosphere:** Dark, quiet, intensely focused, and unyielding. The UI recedes into the gym or crag environment while critical action states slice through via high-visibility functional signals.
- **Visual Stance:** Monospaced metric pacing, structural borders, clean card compartmentalization, and high-contrast typography evoke technical route topo guides and performance hardware.
- **Emotional Impact:** Confidence, physical discipline, and effortless comprehension in split-second glance intervals during grueling intervals.

## Colors

The palette is strictly functional, mapping semantic meaning directly to physiological states and interactive clarity:

- **Canvas & Surfaces:**
  - `Canvas / Canvas Deep` (`#101713`): The deep bedrock base that reduces glare in dim training chambers and outdoor daylight sessions.
  - `Raised Surface` (`#1c2620`): Distinct tactile structural cards, bottom sheets, and grouped data containers.
  - `Subtle Borders` (`#344238`): Structural line borders framing content without causing visual vibration.

- **Actions & Typography:**
  - `Primary Action & Active Indicator` (`#d2f66c`): Acid-lime electric punch reserved for primary progress, start/pause states, completed sets, and interactive focal points.
  - `Primary Text / Foreground` (`#f1f5e9`): High-legibility soft off-white providing maximum contrast against dark surfaces without harsh optical fatigue.
  - `Secondary Text & Subtle UI` (`#9eafa1`): Muted sage used for descriptive route notes, set counts, inactive track markers, and metadata.

- **Training Modality Semantics:**
  - `Work Accent` (`#ff9d6c`): Energetic terracotta orange signaling active hangboard hangs, power intervals, and exertion timers.
  - `Rest Accent` (`#79d5d0`): Glacial cyan indicating structured rest periods, recovery intervals, and prep countdowns.

## Typography

The typography couples the angular, structural precision of `Space Grotesk` with the balanced, unembellished readability of `DM Sans`.

- **Display & Headings:** Set in `Space Grotesk`. Page headlines use 30px with tight tracking and a bold 700 weight for authoritative presence. Card titles, workout module labels, and key metric readouts adopt 20px / 600 weight to maintain high visual impact without overcrowding. Large workout telemetry counters (e.g. countdown seconds, repetitions) scale up to 44px display size using tabular numbers.
- **Body:** Set in `DM Sans` 15px with regular 400 weight on 22px line-height, optimized for workout instructions, beta descriptions, and training logs.
- **Labels, Badges & Topo Metadata:** Set in `DM Sans` 12px or 10px uppercase with generous tracking (`0.08em` to `0.1em`) and 600–700 weight. Used for grade tags (e.g. V7, 7A+), timer states (`WORK`, `REST`, `PREP`), edge depth indicators (e.g., `20MM CRIMP`), and load tags.

## Layout & Spacing

Designed primarily for single-hand mobile web navigation on phone screens while propped against gym pads or hung from equipment racks:

- **Canvas Architecture:** A fluid single-column layout constrained to a maximum width of 480px on larger viewports, centered with balanced outer margins (`margin-mobile`: `16px`, tablet/desktop safe wrapper: `20px`).
- **Rhythm & Grid:** Content stacks vertically inside modular training blocks with a consistent `12px` to `16px` (`space-md` to `gutter`) internal gap rhythm.
- **Reachability:** Critical tactical controls (play, pause, next rep, log send) occupy fixed sticky bottom app bars with safe-area padding (`env(safe-area-inset-bottom)`) and minimum `48px` action heights.
- **Scanability:** Cards provide generous internal padding (`space-lg`: `20px`) to prevent visual crowding when displaying dense climb telemetry.

## Elevation & Depth

Visual hierarchy relies entirely on surface contrast and structural borders rather than blur effects or heavy drop shadows:

- **Flat Tonal Hierarchy:** Base screen canvas sits at `#101713`. Tonal elevation is achieved strictly by elevating containers to `#1c2620`.
- **Crisp Structural Outlines:** Surfaces, cards, and modal panels feature a deliberate 1px solid border in `#344238`. No diffuse shadows or tinted glows are permitted.
- **Tactile Depression:** Interactive elements (buttons, segmented controls, hold selectors) provide physical feedback via CSS transform depression (`translateY(2px)`) accompanied by border color shifts, avoiding floaty ambient lighting in favor of athletic equipment certainty.

## Shapes

The shape system balances ergonomic handheld friendliness with rigid mechanical discipline:

- **Cards & Training Modules:** Fixed 20px corner radius (`rounded-[20px]`). This distinct curvature softens large surface bounds on phone displays while providing ample framing for inner 12px components.
- **Buttons & Interactive Inputs:** Standardized 12px corner radius (`rounded-[12px]`) to maintain a unified tactile footprint across inputs, timer blocks, and buttons.
- **Badges, Route Chips & Tags:** Pill-shaped (`rounded-full`) or 8px rounded tags depending on context (pills for status and climbing grades, 8px squircle for numeric telemetry tags).

## Components

- **Buttons:**
  - _Primary Button:_ Minimum 48px height. Background `#d2f66c`, text `#101713`, font `Space Grotesk` 16px / 700. Active click state: `scale-[0.98]` with dark border.
  - _Secondary / Outlined Button:_ Minimum 48px height. Background transparent, border 1.5px solid `#344238`, text `#f1f5e9`, hover/focus border `#9eafa1`.
  - _Modal Action / Stop Button:_ Background `#ff9d6c`, text `#101713` for instant danger/stop identification.

- **Chips & Grade Badges:**
  - Compact chips for bouldering grades (V-scale, Font), hold types (sloper, crimp, pinch, pocket), and training protocols.
  - Height 28px to 32px. Inactive state: `#1c2620` background with 1px `#344238` border and `#9eafa1` text. Active state: `#d2f66c` background with `#101713` text.

- **Cards & Training Tiles:**
  - Background `#1c2620`, border 1px solid `#344238`, radius 20px, internal padding 20px.
  - No shadows. Sub-sections within cards use hairline dividers (`1px solid #344238`) or nested inset boxes (`#101713` background with 12px radius).

- **Interval Telemetry Timers (Specialized):**
  - Work blocks highlight an unmistakable 3px accent bar or badge in `#ff9d6c` (Work).
  - Rest blocks swap the active UI accents and progress rings to `#79d5d0` (Rest).
  - Monospaced numeric counters with tabular figure alignment.

- **Form Fields & Weight Selectors:**
  - Height 48px, background `#101713`, border 1.5px solid `#344238`, text `#f1f5e9`, radius 12px. Focus state: border `#d2f66c` with no outer glow rings.

- **Lists & Topo Betas:**
  - Compact, high-density row items separated by 1px borders in `#344238`. Left-aligned monoline route hold icons; right-aligned completion badges and rep tallies.

## Implementation

Use the exact brand overrides for actions (#d2f66c), work (#ff9d6c), rest (#79d5d0), canvas (#101713), and typography, rather than the generated Material primary white. Tokens live in src/theme/design-tokens.css; the additional light tokens are derived for future use. The current app uses the dark theme from the supplied Stitch screens.

Sessions are selectable cards. Library groups Drills, Concepts, and Courses. Timer is a direct destination, with essentials first and advanced options collapsed. Coach groups students and practical gym tools. On desktop, use a sidebar and wide grid rather than the generated phone-width constraint. Preserve existing local data keys and timer configurations.

Focused timer: phase label and number, glanceable clock ring, next interval, pause and skip/finish. Work, rest, rep-end and finish have distinct synthesized note patterns. Speech uses the device voices, never downloaded proprietary assets. Reduced-motion preferences disable decorative animation. All interactive targets have at least 44px touch area; core training controls 48px or more.

## Research

- https://smartwod.app/wod-timer
- https://smartwod.app/custom-workout-timer
- https://smartwod.app/box-timer
- Official screenshot reference: https://smartwod.app/assets/img/screens-timer-1200.webp

## Movement Atlas extension — 21 October 2026

Stitch screen bf8ab4969eab4ea6abce6b5b3a1b9caf in the existing project informed the topic detail screen. Reuse the established tokens and four primary destinations. Use a Climber/Coach switch, a single visible content pane, compact qualitative experiment cards and collapsed sources/advanced variations. Keep telemetry and fabricated measurements out of the product. Home session picks remain compact, with coach lessons behind a filter and Core/Performance groups in the pathway.
