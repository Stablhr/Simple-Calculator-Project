# Calculator Website — Design Document

## 1. Design Concept
"**Frosted glass on a glowing dark canvas.**" The calculator floats as a translucent, blurred card above a dark, moody background with a soft blue glow — combining the glass-panel calculator from Image 1 with the atmospheric dark gradient background from Image 2.

## 2. Color Palette
| Role | Color | Notes |
|---|---|---|
| Page background | `#0B0F14` → `#1A2230` gradient | Deep near-black, echoes Image 2's dark half |
| Accent glow (blob behind card) | `#2F6FED` / `#3B82F6` (blue-500) | Soft radial blur, like the blue circle in Image 1 |
| Glass card surface | `white/10` on dark mode, `white/40` on light areas | `backdrop-blur-xl`, 1px `white/20` border |
| Digit buttons | `bg-white/5` → hover `bg-white/10` | Translucent dark tiles, white text |
| Operator buttons (`÷ × − +`) | `bg-blue-500/80` → hover `bg-blue-500` | Solid blue accent, like Image 1 |
| Equals button | `bg-blue-400` with glow shadow | Stands out as primary CTA |
| Function row (`e μ sin deg`) | `bg-white/5`, muted `text-white/50` | Secondary/lighter emphasis, matches faded top row in Image 1 |
| AC / backspace | `bg-white/10`, `text-white/70` | Neutral, slightly muted |
| Display text | `text-white` (result), `text-white/40` (expression) | Big bold result, smaller faded expression above it |

## 3. Typography
- **Font**: Inter / system-ui sans-serif — clean, geometric, matches the condensed bold labels in Image 2.
- **Result display**: `text-4xl sm:text-5xl font-semibold`
- **Expression (input) line**: `text-sm sm:text-base text-white/40`
- **Button labels**: `text-lg sm:text-xl font-medium`
- **Section headings (Instructions)**: `text-xl font-bold tracking-tight`, optionally uppercase/condensed for a nod to the "DOMMAG" stacked lettering in Image 2.

## 4. Layout & Spacing
- Page: full-height flex container, centered content, generous padding
- Background: radial gradient blob (blue, blurred, `blur-3xl`, low opacity) positioned behind/around the card for the glow effect seen in Image 1
- Calculator card: `rounded-[2rem]`, `p-5 sm:p-6`, `max-w-xs sm:max-w-sm`, subtle drop shadow (`shadow-2xl shadow-blue-500/20`)
- Display area: top of card, right-aligned text, ~30–35% of card height
- Keypad: CSS grid, `grid-cols-4 gap-3`, square-ish buttons (`aspect-square`), consistent gutter matching reference spacing
- Instructions/User Guide: separate card below (or beside on desktop) with the same glass treatment but lighter blur, listing supported operations and keyboard shortcuts

## 5. Glass Effect (Tailwind recipe)
```html
<div class="backdrop-blur-xl bg-white/10 border border-white/20 
            rounded-[2rem] shadow-2xl shadow-blue-500/20">
  ...
</div>
```
- Key ingredients: `backdrop-blur-xl` (or `-2xl`), low-opacity background (`/5`–`/15`), thin light border for edge definition, soft colored shadow for depth — never a flat opaque card.

## 6. Button States & Micro-interactions
- **Default**: translucent tile, soft border
- **Hover** (desktop): background lightens one step, slight `scale-[1.03]`
- **Active/press**: `active:scale-95 transition-transform duration-100`
- **Equals button**: subtle pulsing glow (`shadow-blue-400/50`) to draw the eye, matching the bright `=` tile in Image 1
- **Result update**: brief fade/slide-in (`transition-opacity duration-200`) when a new result appears
- **Error state**: display text flashes red briefly (`text-red-400`) then resets

## 7. Responsiveness Rules
| Breakpoint | Calculator width | Button text size | Layout |
|---|---|---|---|
| `< sm` (mobile) | ~90vw, `max-w-xs` | `text-lg` | Single column, instructions below |
| `sm`–`md` (tablet) | `max-w-sm` | `text-xl` | Centered, more padding |
| `lg+` (desktop) | `max-w-sm` fixed | `text-xl` | Calculator centered; instructions can sit beside it in a two-column layout |

## 8. Accessibility Notes
- All buttons are real `<button>` elements with visible focus rings (`focus:ring-2 focus:ring-blue-400`)
- Sufficient contrast: white text on dark translucent tiles (verify against WCAG AA at the chosen opacity)
- Keyboard operability mirrors on-screen buttons (see plan.md §5)
- `aria-live="polite"` on the result display so screen readers announce new results

## 9. Visual Reference Mapping
- **From Image 1**: rounded glass card shape, 4-column grid, blue operator accent, glowing `=` button, faded top utility row (`e μ sin deg`), stacked light/dark card concept (optional theme toggle idea).
- **From Image 2**: dark canvas with a soft light-to-dark diagonal gradient, bold typographic accent for branding/title area, minimal icon row treatment (could inspire a small icon-based footer, e.g. theme toggle / info icon).
