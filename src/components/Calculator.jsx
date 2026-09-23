import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import Display from './Display.jsx'
import Keypad from './Keypad.jsx'
import { initialState, reducer } from '../utils/calculatorState.js'

const KEY_GAP = 12
const MIN_COL = 40

function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [happy, setHappy] = useState(false)
  const [fitW, setFitW] = useState(0)
  const spaceRef = useRef(null)
  const cardRef = useRef(null)
  const historyRef = useRef(null)
  const { expr, result, hasResult, error, history, mode, angle } = state

  let displayText
  let isError = false
  if (hasResult) {
    displayText = error ? 'Error' : result
    isError = error
  } else {
    displayText = expr.trim() === '' ? '0' : expr
  }

  const handlePress = (type, payload) => {
    switch (type) {
      case 'input':
        dispatch({ type: 'INPUT', key: payload })
        break
      case 'operator':
        dispatch({ type: 'OPERATOR', op: payload })
        break
      case 'equals':
        dispatch({ type: 'EQUALS' })
        setHappy(true)
        window.setTimeout(() => setHappy(false), 700)
        break
      case 'clear':
        dispatch({ type: 'CLEAR' })
        break
      case 'backspace':
        dispatch({ type: 'BACKSPACE' })
        break
      case 'angle':
        dispatch({ type: 'ANGLE' })
        break
      case 'wrap':
        dispatch({ type: 'WRAP', kind: payload })
        break
      default:
        break
    }
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const { key } = e
      if (/^[0-9]$/.test(key)) {
        handlePress('input', key)
      } else if (key === '.' || key === '(' || key === ')' || key === '^' || key === '!') {
        handlePress('input', key)
      } else if (key === '+' || key === '-') {
        handlePress('operator', key)
      } else if (key === '*') {
        handlePress('operator', '*')
      } else if (key === '/') {
        e.preventDefault()
        handlePress('operator', '/')
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        handlePress('equals')
      } else if (key === 'Backspace') {
        e.preventDefault()
        handlePress('backspace')
      } else if (key === 'Escape') {
        handlePress('clear')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Fit the whole calculator to the available screen, no scrolling, responsive.
  useLayoutEffect(() => {
    const space = spaceRef.current
    const card = cardRef.current
    if (!space || !card) return undefined

    const measure = () => {
      const keypad = card.querySelector('[data-keypad]')
      if (!keypad) return

      const availW = space.clientWidth
      const availH = space.clientHeight
      const desktop = window.matchMedia('(min-width: 1024px)').matches
      const isSci = mode === 'scientific'
      const sideBySide = isSci && desktop
      const cols = sideBySide ? 8 : 4
      const rows = isSci && !desktop ? 9 : 5

      const cardRect = card.getBoundingClientRect()
      const keypadRect = keypad.getBoundingClientRect()
      const chrome = cardRect.height - keypadRect.height
      const hExtras = cardRect.width - keypadRect.width

      const hist = historyRef.current
      let histH = 0
      let histW = 0
      if (hist) {
        const histRect = hist.getBoundingClientRect()
        if (desktop) {
          histW = histRect.width + 16
        } else {
          histH = histRect.height + Math.max(0, histRect.top - cardRect.bottom)
        }
      }

      const budget = Math.max(0, availH - chrome - histH)
      const colT = Math.max(MIN_COL, (budget - (rows - 1) * KEY_GAP) / rows)

      const maxCardW = Math.max(0, availW - histW)
      let W = cols * colT + (cols - 1) * KEY_GAP + hExtras
      W = Math.min(W, maxCardW)
      W = Math.max(W, Math.min(240, maxCardW))
      W = Math.min(W, maxCardW)

      const rowW = desktop ? W + histW : W
      setFitW(Math.min(availW, Math.max(0, rowW)))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(space)
    return () => observer.disconnect()
  }, [mode, history.length])

  const modeBtn = (m, label) => (
    <button
      type="button"
      onClick={() => dispatch({ type: 'MODE', mode: m })}
      aria-pressed={mode === m}
      className={[
        'flex-1 rounded-full border-[3px] border-bmo-ink px-3 py-1 font-display text-xs font-bold uppercase tracking-widest transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D06B] focus-visible:ring-offset-2',
        mode === m
          ? 'translate-y-[1px] bg-bmo-equals text-bmo-ink shadow-[0_2px_0_0_#1B2E2A]'
          : 'bg-white/60 text-[#5C7A72] hover:bg-white',
      ].join(' ')}
    >
      {label}
    </button>
  )

  return (
    <div
      ref={spaceRef}
      className="no-scrollbar flex h-full min-h-0 w-full items-center justify-center overflow-y-auto"
    >
      <div
        className="flex w-full flex-col items-center gap-4 transition-[width] duration-300 ease-in-out lg:flex-row lg:items-center"
        style={fitW > 0 ? { width: `${fitW}px` } : undefined}
      >
        <div ref={cardRef} className="order-1 w-full lg:order-2">
          <div
            className="w-full rounded-[2.5rem] border-[3px] border-[#1B2E2A] bg-bmo-body p-5 sm:p-6"
        style={{ boxShadow: '0 18px 35px -12px rgba(27, 46, 42, 0.35)' }}
      >
        <div className="mb-1 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border-[3px] border-[#1B2E2A] bg-white px-4 py-2">
            {happy ? (
              <span className="face-happy inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border-[2px] border-[#1B2E2A] bg-bmo-ink" />
                <span className="h-1.5 w-3 rounded-b-full border-2 border-t-0 border-[#1B2E2A]" />
                <span className="h-2.5 w-2.5 rounded-full border-[2px] border-[#1B2E2A] bg-bmo-ink" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-bmo-ink" />
                <span className="text-[15px] leading-none text-[#1B2E2A]">♡</span>
                <span className="h-2.5 w-2.5 rounded-full bg-bmo-ink" />
              </span>
            )}
          </div>
        </div>

        <div className="mb-4 mt-3 flex gap-2">{modeBtn('basic', 'Basic')}{modeBtn('scientific', 'Sci')}</div>
        <Display expression={expr} display={displayText} isError={isError} />

        <div className="mb-4 flex justify-between text-xs font-medium text-[#5C7A72]">
          <span className="rounded-full bg-white/70 px-2 py-0.5">stress na ko ⊙‿⊙</span>
        </div>

        <Keypad mode={mode} angle={angle} press={handlePress} />
        </div>
      </div>

      {history.length > 0 && (
        <div ref={historyRef} className="order-2 w-full lg:order-1 lg:max-w-none lg:w-64">
          <div className="mt-4 w-full rounded-3xl border-[3px] border-[#1B2E2A] bg-bmo-body p-4 shadow-[0_10px_25px_-10px_rgba(184,122,160,0.45)] lg:mt-0">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold tracking-tight text-[#1B2E2A]">✦ history</h2>
            <button
              type="button"
              onClick={() => dispatch({ type: 'HISTORY_CLEAR' })}
              className="rounded-lg border-2 border-[#1B2E2A] bg-bmo-utility px-2 py-1 text-[11px] font-semibold text-bmo-ink transition duration-150 hover:bg-bmo-utility-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D06B]"
            >
              Clear
            </button>
          </div>
          <ul className="no-scrollbar max-h-40 space-y-1 overflow-y-auto">
            {history.map((entry, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'HISTORY_USE', entry })}
                  className="flex w-full items-baseline justify-between gap-3 rounded-xl border-2 border-transparent px-2 py-1 text-right transition duration-150 hover:border-[#1B2E2A]/30 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D06B]"
                >
                  <span className="truncate text-xs text-[#5C7A72]">{entry.expr}</span>
                  <span className="shrink-0 text-sm font-semibold text-[#1B2E2A]">{entry.result}</span>
                </button>
              </li>
            ))}
          </ul>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Calculator