# Calculator Website — Design Document

## 1. Design Concept
"**Kawaii sticker calculator.**" The calculator is a solid, cream-colored rounded card that floats over a soft pink striped background — a friendly, hand-illustrated "cute sticker" aesthetic instead of glass. It blends two references: floppy-ear-shaped cream body with pastel circle keys and a thick sketchy dark outline (Ref 1), and a minimalist cream body with a built-in face, blush cheeks, and a single standout orange `=` button (Ref 2).

## 2. Color Palette
| Role | Color | Notes |
|---|---|---|
| Page background | `#FFE3EF` / `#FFD6E9` vertical stripes | Soft pastel pink repeating stripes (`110px` wide bands) |
| Floating shapes | ☁️ 💗 🌸 💫 🫧 | Low opacity, slow `floaty` bounce animation |
| Body / card | `#FFF9EE` warm cream | Solid, sticker-like; **no glass/blur** |
| Outline | `#4E3B31` warm dark brown | Thick `3px` border on card, display, keys, chips — "crayon" feel |
| Display | `bg-sky-100` pale blue | Rounded, big bold digits `#4E3B31`, bunny `🐰` corner icon |
| Number keys | `#BFF3D1` mint | Circular with thick brown outline + puffy bottom shadow |
| Operator keys | `#FFE29A` butter yellow | Rounded-square, same sticker treatment |
| Equals key | `#FF9A62` coral | The one "pop" color, white digits, glow pulse |
| Utility keys (AC, ⌫, `( )`) | `#FFD9E8` blush pink | Muted taupe/rose text |
| Function keys (sci) | `#E4DBFF` lavender | sin/cos/tan, ln/log/√, x²/xˣ/x!, π/e, 1/x, ± |
| Face blush | `#FFB3C8` | Two small pink circles near the face |
| Body text | `#4E3B31` | Warm brown ink everywhere |
| Muted accents | `#B089A0` / `#8A9DB0` | Secondary labels ("cute math", expression line) |

## 3. Typography
- **Font**: **Fredoka** (Google Fonts), rounded friendly sans — fallback Quicksand / system-ui.
- **Result display**: `font-display`, `text-4xl sm:text-5xl font-bold`, ink `#4E3B31`.
- **Expression line**: `text-sm sm:text-base`, muted `#8A9DB0` (top-left of display beneath bunny icon).
- **Button labels**: `text-lg sm:text-xl font-semibold`.
- **Headings**: `font-display font-bold`, e.g. page title "cute calculator ◡̈" and history title "✦ history".

## 4. Layout & Spacing
- Page: full-height flex container, centered content, generous padding. Pastel striped background with 5–6 absolutely-positioned floating emoji shapes (clouds/hearts/flowers) animated with a gentle 6s `floaty` keyframe.
- Calculator card: `rounded-[2.5rem]`, `border-[3px] border-[#4E3B31]`, `bg-[#FFF9EE]`, soft warm drop shadow (`rgba(184,122,160,.45)`). No backdrop blur.
- Face chip: centered pill below the top of the card — two dot eyes + `♡` mouth, blush dots beside it. On `=` press it swaps to a happy "wobble" face (`^ ^` pinched eyes + smile) for ~700ms.
- Display: top of card, `rounded-3xl bg-sky-100`, thick brown border, bunny icon `🐰` top-left, right-aligned digits. The decorator pill/DEG badge was removed — the expression line reflows to fill the row (bunny left, expression right-aligned).
- Between display and keypad: two small muted pill labels ("cute math", "no stress ⊙‿⊙") for charm.
- Mode toggle: two rounded-full `Basic` / `Sci` pills, butter-yellow when active with a 2px brown under-shadow.
- Keypad: CSS grid `grid-cols-4 gap-3`, square buttons; sci rows appear only in Sci mode.
- History: cream card matching body, `✦ history` title, blush "Clear" chip, hover states on entries.

## 5. Sticker / Button Recipe (Tailwind)
```html
<button class="aspect-square rounded-2xl border-[3px] border-[#4E3B31]
               bg-mint text-[#4E3B31]
               shadow-[0_4px_0_0_#4E3B31]          <!-- puffy sticker bottom edge -->
               transition-all duration-150 ease-out
               active:translate-y-[3px] active:scale-90 active:shadow-none">
  7
</button>
```
- Key ingredients: solid pastel fill, thick dark outline, a solid `4px` drop shadow that creates the "puffy sticker" edge, and a press state that squishes the button down (`translate-y + scale-90` + shadow removed) — the springy/bouncy feel.
- Equal button reuses the same recipe but in coral, plus a gentle `equals-glow` pulse animation.

## 6. States & Micro-interactions
- **Hover** (desktop): fill lightens to the `*-dark` pastel variant.
- **Press**: `active:translate-y-[3px] active:scale-90 active:shadow-none` — squishy sticker bounce.
- **Equals**: coral glow pulse + the face reacts with a wobble/happy expression.
- **Result update**: brief fade/slide-in (`result-animate`) when the big digit line changes.
- **Error state**: display text flashes red (`text-red-500`) then shows `Error` until next input.
- **Focus**: `focus-visible:ring-2 ring-[#FF8A8A]` with ring offset for accessibility.

## 7. Responsiveness Rules
| Breakpoint | Calculator width | Button text size | Layout |
|---|---|---|---|
| `< sm` (mobile) | `max-w-xs` | `text-lg` | Single column, history below |
| `sm`–`md` (tablet) | `max-w-sm` | `text-xl` | Centered, more padding |
| `lg+` (desktop) | `max-w-sm` fixed | `text-xl` | Calculator centered; history below |

## 8. Accessibility Notes
- All buttons are real `<button>` elements with visible focus rings.
- Sufficient contrast: dark brown ink `#4E3B31` on pastel fills (WCAG AA on mint/yellow; white on coral for `=`).
- Keyboard operability mirrors on-screen buttons (digits, `+ - * /`, `Enter`, `Backspace`, `Escape`, `^ ! ( )`).
- `aria-live="polite"` on the result display; expression line is `aria-hidden`.
- `aria-pressed` on Basic/Sci toggle and DEG/RAD toggle.

## 9. Callbacks to the Reference Images
- **From Ref 1**: cream rounded body, mint circle number keys with thick sketchy dark outline, vertical pastel-stripe background, hand-illustrated crayon edge (emulated with thick borders + solid sticker shadows).
- **From Ref 2**: two dot eyes + smile + blush cheeks built into the body under the display, minimal warm-taupe operator keys vs a single standout warm-orange `=`, soft drop shadow giving a floating sticker feel.

## 10. Functionality Note (keep intact)
All existing behavior stays unchanged: basic + scientific operator set, safe expression parser (no `eval`), keyboard support, divide-by-zero / malformed-expression handling (graceful `Error`), transform/negate/1/x wraps, angle DEG/RAD, and calculation history.