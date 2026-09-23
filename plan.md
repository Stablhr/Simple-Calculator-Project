# Calculator Website — Project Plan

## 1. Overview
A responsive calculator web app built with **React** and **Tailwind CSS**, featuring a **kawaii sticker** UI with a **BMO (Adventure Time) inspired palette** — a solid mint-green calculator card with thick dark outlines, puffy sticker keys, and a dark glowing screen, floating over a soft pastel striped background with drifting emoji shapes.

## 2. Goals
- Fully functional calculator: basic operations plus a scientific-lite set (`sin cos tan ln log √ x² xʸ x! π e 1/x ±`, DEG/RAD)
- Fit-to-screen responsive layout — no page scrolling, on mobile, tablet, and desktop
- Sticker-style card: solid pastel fill, thick outline, puffy key shadows, squishy press feedback
- Calculation history side panel (desktop) / below (mobile)
- Clean header (name/section) and footer (GitHub link) framing the app
- Smooth interactivity: click + keyboard support, graceful error handling, subtle animations

## 3. Tech Stack
| Layer | Tool |
|---|---|
| UI Library | React 19 (functional components + hooks) |
| Styling | Tailwind CSS v4 (`@theme` design tokens, utility classes) |
| State | `useReducer` (`calculatorState.js`) + local `useState` for UI flourishes |
| Logic | Custom expression evaluator — tokenizer + recursive-descent parser (no `eval`) |
| Build | Vite + `@vitejs/plugin-react`, `@tailwindcss/vite` |
| Lint / Test | oxlint, `node --test` (`tests/calculator.test.mjs`) |

## 4. Component Structure
```
src/
 ├─ App.jsx                → page shell: striped background, floating emojis,
 │                           header (name + BSIT 3-3), footer (GitHub link)
 ├─ components/
 │   ├─ Calculator.jsx     → state owner (useReducer), keyboard listener,
 │   │                       fit-to-screen sizing, face chip, mode toggle, history
 │   ├─ Display.jsx        → expression line + result (auto-shrink, flash, aria-live)
 │   ├─ Keypad.jsx         → declarative basic/sci button grids
 │   ├─ Button.jsx         → sticker button (variants: digit/operator/equals/utility/function/toggle)
 │   └─ (history panel inline in Calculator.jsx)
 ├─ utils/
 │   ├─ calculatorState.js → reducer: input/operator/equals/clear/backspace/
 │   │                       angle/mode/wrap/history actions
 │   └─ calculate.js       → safe tokenizer + parser + evaluator + formatResult
 └─ index.css              → @theme BMO tokens, kawaii-bg stripes, keyframes
```

## 5. Core Features (React requirements)
1. **Button click events** — digits/operators append to the current expression via reducer actions.
2. **Live calculation on `=`** — expression parsed and evaluated; result replaces display; history entry pushed (max 12).
3. **Clear / Reset (`AC`)** — resets expression and result to empty state.
4. **Backspace (`⌫`)** — removes last character.
5. **Keyboard support** — global `keydown`: digits, `. ( ) ^ !`, `+ - * /`, `Enter` (=), `Backspace`, `Escape` (AC); modifier combos ignored.
6. **Error handling** — divide-by-zero, invalid numbers, malformed expressions show red `Error` instead of crashing; next input starts fresh.
7. **Basic / Sci mode toggle** — segmented pills switch keypad layouts (`aria-pressed`).
8. **DEG/RAD toggle** — angle mode feeds the parser's trig functions.
9. **History panel** — click an entry to reload its expression; Clear button; only rendered when non-empty.
10. **Animations** — squishy key press (`translate-y + scale + shadow-none`), `equals-glow` pulse, happy-face wobble on `=`, result flash/slide-in.

## 6. Sections Required
- **Header**: student name + `:)`, section subtitle (BSIT 3-3).
- **Calculator card**: face chip → Basic/Sci toggle → display → tagline pill → keypad (sci block above the pad, or beside it on `lg+`).
- **History card**: `✦ history` title, entries, Clear chip — left of calculator at `md+`, below on mobile.
- **Footer**: GitHub project link.

## 7. Design Direction (from references)
- **Ref 1 (cute sticker calculator)**: cream/pastel rounded body, circular outlined keys, thick sketchy dark outline, vertical pastel-stripe background — emulated with `border-[3px]` + solid offset sticker shadows.
- **Ref 2 (minimal face calculator)**: dot eyes + smile + blush built into the body, one standout `=` key, soft floating drop shadow.
- **Combined + retheme**: kawaii sticker structure kept, palette swapped to **BMO green** (`#a8d8b9` body, `#1B2E2A` ink, dark screen with glowing `#c9f0d6` digits, coral operators `#d98b7a`, golden equals `#f2d06b`), pastel blue stripes, Fredoka type. See `design.md` for the full spec.

## 8. Responsiveness Plan
- Fit-to-screen: `useLayoutEffect` + `ResizeObserver` measures available space and sizes keys/card so the whole app fits without scrolling (`body { overflow: hidden }`, `100dvh` shell).
- History side panel at `≥768px`; sci keypad side-by-side with main pad at `≥1024px`; stacked below those breakpoints.
- Auto-shrinking result text (`ResizeObserver` on the display) so long results never clip.
- Mobile-first breakpoints (`sm`, `md`, `lg`) for font sizes and padding.

## 9. Build Steps
1. Scaffold React app (Vite) + install Tailwind ✅
2. Build `Display` and static `Keypad` layout ✅
3. Wire up reducer state + calculation engine (`utils/calculate.js`) ✅
4. Add keyboard event support ✅
5. Add error handling (divide by zero, invalid expression) ✅
6. Apply sticker styling + BMO palette + striped background ✅
7. Add button animations, face reaction, result flash ✅
8. Add Basic/Sci toggle, DEG/RAD, scientific keys ✅
9. Add calculation history with reuse/clear ✅
10. Fit-to-screen responsive sizing across breakpoints ✅
11. Tests (`node --test`) + oxlint ✅
12. Polish (stale `index.html` meta description/theme-color, favicon, final QA) ⬜

## 10. Stretch Goals (optional, time-permitting)
- Persist history to `localStorage`
- Light/dark theme toggle
- Copy result to clipboard
- Memory keys (M+/MR)
