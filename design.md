# Calculator Website — Design Document

## 1. Design Concept
"**Kawaii sticker calculator with a BMO heart.**" The calculator is a solid, mint-green rounded card that floats over a soft pastel striped background — a friendly, hand-illustrated "cute sticker" aesthetic (thick dark outlines, puffy key edges, squishy presses). It blends two references: floppy-ear-shaped cream body with pastel circle keys and a thick sketchy dark outline (Ref 1), and a minimalist cream body with a built-in face and a single standout `=` button (Ref 2). The palette was later rethemed to an **Adventure Time BMO** scheme: mint body, dark-green glowing screen, coral operators, golden equals.

## 2. Color Palette
Defined as Tailwind v4 `@theme` tokens (`--color-bmo-*`) in `src/index.css`.

| Role | Color | Notes |
|---|---|---|
| Page background | `#EAF4FB` / `#DDEBF4` vertical stripes | Soft pastel blue repeating stripes (`110px` wide bands), `.kawaii-bg` |
| Floating shapes | ☁️ 💗 🌸 💫 🫧 | Low opacity, slow `floaty` bounce animation (6s) |
| Body / card | `#A8D8B9` BMO mint (`bmo-body`) | Solid, sticker-like; **no glass/blur**; hover/edge variant `#93CB9F` |
| Outline / ink | `#1B2E2A` warm dark green (`bmo-ink`) | Thick `3px` border on card, display, keys, chips — "crayon" feel |
| Display screen | `#1B2E2A` (`bmo-screen`) + edge `#2E554B` | Dark retro screen, hard bottom shadow `#11251F` |
| Display digits | `#C9F0D6` glow / `#EDF5EF` (`bmo-glow` / `bmo-digit`) | Bright glowing result text; expression line `#9ECFAD` |
| Number keys | `#EDF5EF` near-white (`bmo-digit`) | Rounded-square with thick ink outline + puffy bottom shadow |
| Operator keys | `#D98B7A` coral (`bmo-operator`) | Darker hover `#C97A68` |
| Equals key | `#F2D06B` gold (`bmo-equals`) | The one "pop" color, pulsing `equals-glow` |
| Utility keys (AC, ⌫, history Clear) | `#C9CFCB` sage gray (`bmo-utility`) | Same sticker treatment |
| Function keys (sci) | `#A9C8BD` sage (`bmo-func`) | sin/cos/tan, ln/log/√, x²/xʸ/x!, π/e, 1/x, ±, DEG/RAD |
| Face chip | white pill, ink eyes + `♡` mouth | Swaps to happy pinched-eyes face (`wobble`) for ~700ms on `=` |
| Accent (title smile, focus rings, hover) | `#F2D06B` gold / `#F2D06B` ring | Secondary highlight color |
| Muted labels | `#5C7A72` / `#7A9A92` / `#9ECFAD` | Taglines, footer, expression line |

## 3. Typography
- **Font**: **Fredoka** (Google Fonts), rounded friendly sans — fallback Quicksand / system-ui (`--font-display`, `--font-sans`).
- **Result display**: `font-display`, `text-3xl → 5xl` responsive + auto-shrink to fit width, glow `#C9F0D6`.
- **Expression line**: `text-sm sm:text-base`, muted `#9ECFAD` (top of screen beside 🐰 icon).
- **Button labels**: `text-lg sm:text-xl font-semibold`.
- **Headings**: `font-display font-bold`, e.g. page title "Samson, Aries B. :)" and history title "✦ history".
- **Mode pills**: `text-xs font-bold uppercase tracking-widest`.

## 4. Layout & Spacing
- Page: `h-[100dvh]` no-scroll shell (`.kawaii-bg` striped background) with 6 absolutely-positioned floating emoji shapes animated with a gentle 6s `floaty` keyframe.
- Header: centered name + gold `:)`, "BSIT 3-3" subtitle. Footer: GitHub link.
- Calculator card: `rounded-[2.5rem]`, `border-[3px] border-[#1B2E2A]`, `bg-bmo-body`, warm drop shadow. No backdrop blur.
- Face chip: centered white pill below the top of the card — two dot eyes + `♡` mouth. On `=` press it swaps to a happy "wobble" face for ~700ms.
- Mode toggle: two rounded-full `Basic` / `Sci` pills, gold when active with a `0 2px 0` brown under-shadow (`aria-pressed`).
- Display: dark screen `rounded-3xl`, thick edge border, 🐰 icon top-left, right-aligned expression + big glowing result; flash/slide-in animation on change; auto-shrinking font.
- Between display and keypad: muted pill tagline ("stress na ko ⊙‿⊙").
- Keypad: CSS grid `grid-cols-4 gap-3` per block; sci block stacks above the main pad, or sits **beside** it (`lg+`); fit-to-screen auto-sizing keeps everything visible without scroll.
- History: mint card matching body, `✦ history` title, sage "Clear" chip, hover states on entries; **left of calculator at `md+`**, below on mobile.

## 5. Sticker / Button Recipe (Tailwind)
```html
<button class="aspect-square rounded-2xl border-[3px] border-[#1B2E2A]
               bg-bmo-digit text-[#1B2E2A]
               shadow-[0_4px_0_0_#1B2E2A]          <!-- puffy sticker bottom edge -->
               transition-all duration-150 ease-out
               active:translate-y-[3px] active:scale-90 active:shadow-none">
  7
</button>
```
- Key ingredients: solid pastel fill, thick ink outline, a solid `4px` drop shadow that creates the "puffy sticker" edge, and a press state that squishes the button down (`translate-y + scale-90` + shadow removed) — the springy/bouncy feel.
- Equals button reuses the same recipe in gold, plus a gentle `equals-glow` pulse animation.
- Variants: `digit / operator / equals / utility / function / toggle` (see `Button.jsx`).

## 6. States & Micro-interactions
- **Hover** (desktop): fill lightens to the `*-dark` token variant.
- **Press**: `active:translate-y-[3px] active:scale-90 active:shadow-none` — squishy sticker bounce.
- **Equals**: gold glow pulse + the face reacts with a wobble/happy expression (~700ms).
- **Result update**: brief fade/slide-in (`result-animate`) when the big digit line changes; expression flashes too.
- **Error state**: result text turns red (`text-red-400`) with a longer flash, shows `Error` until next input.
- **Focus**: `focus-visible:ring-2 ring-[#F2D06B] ring-offset-2` for accessibility.

## 7. Responsiveness Rules
| Breakpoint | Layout | Notes |
|---|---|---|
| `< md` (mobile) | Single column: calculator, history below | Sci keys stack above pad; fit-to-screen shrinks keys (min 44px) |
| `md` (tablet) | History card **beside** calculator (left) | Width animates with mode |
| `lg+` (desktop) | Sci keypad **side-by-side** with main pad (8-col) | Everything centered, no scroll |

- Fit logic lives in `Calculator.jsx` (`useLayoutEffect` + `ResizeObserver`): measures available space, key size, chrome, and history footprint, then sets a container width so the whole app fits the viewport.

## 8. Accessibility Notes
- All buttons are real `<button>` elements with visible focus rings.
- Sufficient contrast: dark ink `#1B2E2A` on pastel fills (WCAG AA on mint/gray/sage; ink on gold/coral for `=`).
- Keyboard operability mirrors on-screen buttons (digits, `+ - * /`, `Enter`, `Backspace`, `Escape`, `^ ! ( )`).
- `aria-live="polite"` on the result display; expression line is `aria-hidden`.
- `aria-pressed` on Basic/Sci toggle and DEG/RAD toggle.

## 9. Callbacks to the Reference Images
- **From Ref 1**: rounded body, outlined keys with thick sketchy dark outline, vertical pastel-stripe background, hand-illustrated crayon edge (emulated with thick borders + solid sticker shadows).
- **From Ref 2**: two dot eyes + smile built into the body under the display, minimal utility keys vs a single standout `=` color, soft drop shadow giving a floating sticker feel.
- **Divergence**: palette intentionally shifted from cream/pink to the BMO mint/gold/coral scheme while keeping the sticker construction intact.

## 10. Functionality Note (keep intact)
All existing behavior stays unchanged: basic + scientific operator set, safe expression parser (no `eval`), keyboard support, divide-by-zero / malformed-expression handling (graceful `Error`), transform/negate/1/x wraps, angle DEG/RAD, Basic/Sci modes, and calculation history (max 12, click to reuse, clear).
