const OPS = [
  { symbol: '+', desc: 'Addition' },
  { symbol: '\u2212', desc: 'Subtraction' },
  { symbol: '\u00D7', desc: 'Multiplication' },
  { symbol: '\u00F7', desc: 'Division' },
]

const SCI_KEYS = [
  ['sin', 'cos', 'tan'],
  ['ln', 'log', 'sqrt'],
  ['x\u02B2', 'x\u02B8', 'x!'],
  ['\u03C0 (pi)', 'e (Euler)', '1/x'],
]

const SHORTCUTS = [
  ['0\u20139, .', 'Digits and decimal point'],
  ['+ - * /', 'Operators'], 
  ['Enter', 'Calculate ( = )'],
  ['Backspace', 'Delete last character'],
  ['Escape', 'Clear all (AC)'],
  ['^ ! ( )', 'Power, factorial, brackets (Sci)'],
]

function InstructionsPanel() {
  return (
    <section
      className="mt-6 w-full max-w-xs sm:max-w-sm"
      aria-label="How to use"
    >
      <div className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-md sm:p-6">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-white">How to use</h2>

        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-white/70">Operations</h3>
          <ul className="space-y-1.5">
            {OPS.map((op) => (
              <li key={op.symbol} className="flex items-center gap-3 text-sm text-white/60">
                <span className="inline-flex h-6 w-9 items-center justify-center rounded-lg bg-white/5 font-medium text-white/90">
                  {op.symbol}
                </span>
                {op.desc}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-white/70">
            Scientific keys <span className="font-normal text-white/40">(Sci mode)</span>
          </h3>
          <ul className="space-y-1.5 text-sm text-white/60">
            {SCI_KEYS.map((group, i) => (
              <li key={i} className="flex gap-1.5">
                {group.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center justify-center rounded-lg bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70"
                  >
                    {k}
                  </span>
                ))}
              </li>
            ))}
            <li className="text-xs text-white/40">DEG / RAD toggles trig angle units.</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-white/70">Keyboard shortcuts</h3>
          <dl className="space-y-1.5">
            {SHORTCUTS.map(([key, desc]) => (
              <div key={key} className="flex items-baseline gap-3 text-sm">
                <dt className="w-28 shrink-0">
                  <kbd className="rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-white/80">{key}</kbd>
                </dt>
                <dd className="text-white/60">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default InstructionsPanel