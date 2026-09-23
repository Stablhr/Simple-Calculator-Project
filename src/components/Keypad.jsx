import Button from './Button.jsx'

const SCI_ROWS = [
  [
    { label: 'sin', key: 'sin' },
    { label: 'cos', key: 'cos' },
    { label: 'tan', key: 'tan' },
    { label: 'DEG', key: 'angle', toggle: true },
  ],
  [
    { label: 'ln', key: 'ln' },
    { label: 'log', key: 'log' },
    { label: '\u221A', key: 'sqrt' },
    { label: 'x\u02B2', key: 'square' },
  ],
  [
    { label: '\u03C0', key: 'pi' },
    { label: 'e', key: 'e' },
    { label: 'x\u02B8', key: 'power' },
    { label: 'x!', key: 'factorial' },
  ],
  [
    { label: '(', key: '(' },
    { label: ')', key: ')' },
    { label: '1/x', key: 'reciprocal' },
    { label: '\u00B1', key: 'negate' },
  ],
]

const MAIN_ROWS = [
  [
    { label: 'AC', key: 'clear', variant: 'utility' },
    { label: '\u232B', key: 'backspace', variant: 'utility' },
    { label: '(', key: '(' },
    { label: ')', key: ')' },
  ],
  [
    { label: '7', key: '7' },
    { label: '8', key: '8' },
    { label: '9', key: '9' },
    { label: '\u00F7', key: '/', variant: 'operator' },
  ],
  [
    { label: '4', key: '4' },
    { label: '5', key: '5' },
    { label: '6', key: '6' },
    { label: '\u00D7', key: '*', variant: 'operator' },
  ],
  [
    { label: '1', key: '1' },
    { label: '2', key: '2' },
    { label: '3', key: '3' },
    { label: '\u2212', key: '-', variant: 'operator' },
  ],
  [
    { label: '0', key: '0', className: 'col-span-2' },
    { label: '.', key: '.' },
    { label: '=', key: '=', variant: 'equals' },
  ],
]

const FUNC_KEYS = ['sin', 'cos', 'tan', 'ln', 'log', 'sqrt']
const SCI_ACTIONS = new Set(['angle', 'square', 'power', 'factorial', 'reciprocal', 'negate'])

function Keypad({ mode, angle, press }) {
  const toVariant = ({ variant, key }) => {
    if (variant) return variant
    if (FUNC_KEYS.includes(key) || SCI_ACTIONS.has(key)) return 'function'
    if ('*/-'.includes(key)) return 'operator'
    return 'digit'
  }

  const handle = (btn) => {
    const { key } = btn
    if (key === 'clear') press('clear')
    else if (key === 'backspace') press('backspace')
    else if (key === '=') press('equals')
    else if (key === 'angle') press('angle')
    else if (key === 'negate') press('wrap', 'negate')
    else if (key === 'reciprocal') press('wrap', 'reciprocal')
    else if (key === 'square') press('input', '^2')
    else if (key === 'power') press('input', '^')
    else if (key === 'factorial') press('input', '!')
    else if (key === 'pi') press('input', '\u03C0')
    else if (key === 'e') press('input', 'e')
    else if (FUNC_KEYS.includes(key)) press('input', `${key}(`)
    else if ('*/-+'.includes(key)) press('operator', key)
    else press('input', key)
  }

  const angleActive = angle === 'deg'

  return (
    <div className="space-y-3">
      {mode === 'scientific' && (
        <div className="space-y-3">
          {SCI_ROWS.map((row, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-3">
              {row.map((btn, i) => (
                <Button
                  key={i}
                  label={btn.toggle ? (angleActive ? 'DEG' : 'RAD') : btn.label}
                  onClick={() => handle(btn)}
                  variant={btn.toggle ? 'toggle' : toVariant(btn)}
                  active={btn.toggle && angleActive}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {MAIN_ROWS.map((row, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-3">
            {row.map((btn, i) => (
              <Button
                key={i}
                label={btn.label}
                onClick={() => handle(btn)}
                variant={toVariant(btn)}
                className={btn.className}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Keypad