# Calculator Website — Project Plan

## 1. Overview
A responsive calculator web app built with **React** and **Tailwind CSS**, featuring a minimalist, aesthetic UI with a **glassmorphism** calculator panel floating over an **eye-catching gradient/dark background** (inspired by the two reference images: a frosted-glass calculator card, and a moody dark wallpaper with a soft light gradient sweep).

## 2. Goals
- Fully functional calculator (basic + scientific-lite ops based on reference: `+ − × ÷ . = AC ⌫ e μ sin deg`)
- Responsive across mobile, tablet, and desktop
- Glass-effect (frosted/blurred) calculator card
- Clean, distraction-free instructions/user guide section
- Smooth interactivity: click + keyboard support, error handling, subtle animations

## 3. Tech Stack
| Layer | Tool |
|---|---|
| UI Library | React (functional components + hooks) |
| Styling | Tailwind CSS (utility classes, `backdrop-blur`, `bg-white/10` etc. for glass effect) |
| State | `useState` / `useReducer` for calculator engine |
| Logic | Custom expression evaluator (safe, no raw `eval`) |
| Icons (optional) | lucide-react for AC/backspace icons |

## 4. Component Structure
```
src/
 ├─ App.jsx                → page layout, background
 ├─ components/
 │   ├─ Calculator.jsx     → holds state, wires everything together
 │   ├─ Display.jsx        → shows expression + result
 │   ├─ Keypad.jsx         → renders buttons grid
 │   ├─ Button.jsx         → single reusable button (number/operator/action)
 │   └─ InstructionsPanel.jsx → "how to use" section
 └─ utils/
     └─ calculate.js       → parses + evaluates expression safely
```

## 5. Core Features (React requirements)
1. **Button click events** — numbers/operators append to the current expression in state.
2. **Live calculation on `=`** — expression is parsed and evaluated, result replaces display.
3. **Clear / Reset (`AC`)** — resets expression and result to empty state.
4. **Backspace (`⌫`)** — removes last character.
5. **Keyboard support** — `keydown` listener maps digits, `+ - * /`, `Enter` (=), `Backspace`, `Escape` (AC).
6. **Error handling** — divide-by-zero and malformed expressions show `Error` instead of crashing, with auto-reset on next input.
7. **Animations/button effects** — `active:scale-95`, `transition`, subtle glow on `=` button, fade-in on result update.

## 6. Sections Required
- **Calculator Interface (main page)**: display screen, digits 0–9, operators, decimal, AC, backspace, `=`.
- **Instructions / User Guide**: short card or modal explaining supported operations (`+ − × ÷ .`), keyboard shortcuts, and how the display/result works.

## 7. Design Direction (from references)
- **Image 1 (calculator UI)**: two stacked glass cards (light + dark variant), rounded-3xl corners, soft shadow, blue accent buttons for operators, `=` in solid blue with glow, numbers in translucent dark tiles.
- **Image 2 (theme)**: dark, moody background with a soft diagonal light gradient (black → grey → white sweep), bold condensed typography accents, small scattered icon dots — used as inspiration for the **page background**, not the calculator card itself.
- Combined direction: dark page background with a subtle animated gradient blob (blue glow, like image 1's background), calculator card uses `backdrop-blur-xl` + semi-transparent white/dark surface for the glass effect, blue accent color for operators/equals.

## 8. Responsiveness Plan
- Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`)
- Calculator card: fixed max-width (`max-w-xs`/`sm`), centered with flexbox, scales padding/font-size per breakpoint
- Buttons: CSS grid (`grid-cols-4`), aspect-square buttons so they scale proportionally
- Instructions panel: stacks below calculator on mobile, side-by-side on larger screens (optional)

## 9. Build Steps
1. Scaffold React app (Vite) + install Tailwind
2. Build `Display` and static `Keypad` layout matching reference proportions
3. Wire up state + calculation logic (`utils/calculate.js`)
4. Add keyboard event support
5. Add error handling (divide by zero, invalid expression)
6. Apply glass-effect styling + gradient background
7. Add button animations/transitions
8. Build Instructions/User Guide section
9. Test responsiveness across breakpoints
10. Polish (favicon, meta title, final QA)

## 10. Stretch Goals (optional, time-permitting)
- Light/dark theme toggle (echoing the two-tone calculator in image 1)
- Calculation history list
- Scientific functions (`sin`, `deg`, `e`, `μ` shown in reference) as a toggleable second row
