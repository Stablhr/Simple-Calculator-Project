import { useEffect, useMemo, useReducer } from 'react'
import Display from './Display.jsx'
import Keypad from './Keypad.jsx'
import { evaluateExpression, formatResult } from '../utils/calculate.js'

const DISPLAY_OPS = { '*': '\u00D7', '/': '\u00F7', '-': '\u2212' }
const OP_CHARS = new Set(['+', '\u00D7', '\u00F7', '\u2212', '*', '/', '-', '^'])

const initialState = {
  expr: '',
  result: '',
  hasResult: false,
  overwrite: false,
  error: false,
  history: [],
  mode: 'basic',
  angle: 'deg',
}

function reducer(state, action) {
  switch (action.type) {
    case 'INPUT': {
      const { key } = action
      if (state.error || state.overwrite) {
        return { ...state, expr: key, result: '', hasResult: false, overwrite: false, error: false }
      }
      if (key === '.') {
        const segment = state.expr.split(/[+\u00D7\u00F7\u2212*/\-^()!]/).pop()
        if (segment.includes('.')) return state
      }
      return { ...state, expr: state.expr + key, error: false }
    }

    case 'OPERATOR': {
      const op = DISPLAY_OPS[action.op] ?? action.op
      if (state.error) {
        return { ...state, expr: '', hasResult: false, error: false }
      }
      let base
      if (state.overwrite && state.result !== '') {
        base = state.result
      } else {
        base = state.expr || '0'
      }
      const last = base[base.length - 1]
      const expr = last && OP_CHARS.has(last) ? base.slice(0, -1) + op : base + op
      return { ...state, expr, result: '', hasResult: false, overwrite: false }
    }

    case 'EQUALS': {
      const expr = state.expr
      const res = evaluateExpression(expr, state.angle)
      if (!res.ok) {
        return { ...state, result: '', hasResult: true, overwrite: false, error: true }
      }
      const text = formatResult(res.value)
      const history = [{ expr, result: text }, ...state.history].slice(0, 12)
      return { ...state, result: text, hasResult: true, overwrite: true, error: false, history }
    }

    case 'CLEAR':
      return { ...state, expr: '', result: '', hasResult: false, overwrite: false, error: false }

    case 'BACKSPACE': {
      if (state.error || state.overwrite) {
        return { ...state, expr: '', result: '', hasResult: false, overwrite: false, error: false }
      }
      return { ...state, expr: state.expr.slice(0, -1) }
    }

    case 'MODE':
      return { ...state, mode: action.mode }

    case 'ANGLE':
      return { ...state, angle: state.angle === 'deg' ? 'rad' : 'deg' }

    case 'WRAP': {
      const res = evaluateExpression(state.expr || state.result, state.angle)
      if (!res.ok) return state
      const v = res.value
      if (action.kind === 'negate') {
        const text = v === 0 ? '0' : v < 0 ? formatResult(-v) : `-${formatResult(v)}`
        return { ...state, expr: text, result: '', hasResult: false, overwrite: false, error: false }
      }
      if (action.kind === 'reciprocal') {
        if (v === 0) {
          return { ...state, result: 'Error', hasResult: true, error: true }
        }
        return {
          ...state,
          expr: `1/(${formatResult(v)})`,
          result: '',
          hasResult: false,
          overwrite: false,
          error: false,
        }
      }
      return state
    }

    case 'HISTORY_USE': {
      const { expr, result } = action.entry
      if (expr && expr !== result) return { ...state, expr }
      return { ...state, expr: result, result, hasResult: true, overwrite: false, error: false }
    }

    case 'HISTORY_CLEAR':
      return { ...state, history: [] }

    default:
      return state
  }
}

function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { expr, result, hasResult, error, history, mode, angle } = state

  const preview = useMemo(() => evaluateExpression(expr, angle), [expr, angle])

  const liveEval = expr.trim() !== '' && !hasResult

  let displayText
  let isError = false
  if (error && expr.trim() !== '') {
    displayText = 'Error'
    isError = true
  } else if (hasResult && result !== '') {
    displayText = result
  } else if (liveEval) {
    if (preview.ok) {
      displayText = formatResult(preview.value)
    } else {
      displayText = 'Error'
      isError = true
    }
  } else {
    displayText = '0'
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

  const modeBtn = (m, label) => (
    <button
      type="button"
      onClick={() => dispatch({ type: 'MODE', mode: m })}
      aria-pressed={mode === m}
      className={[
        'flex-1 rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
        mode === m ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10',
      ].join(' ')}
    >
      {label}
    </button>
  )

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm">
      <div
        className="rounded-[2rem] border border-white/20 bg-white/10 p-5 backdrop-blur-xl sm:p-6"
        style={{ boxShadow: '0 25px 50px -12px rgba(59,130,246,0.25)' }}
      >
        <div className="mb-4 flex gap-2">{modeBtn('basic', 'Basic')}{modeBtn('scientific', 'Sci')}</div>
        <Display expression={expr} display={displayText} angleMode={angle} isError={isError} />
        <Keypad mode={mode} angle={angle} press={handlePress} />
      </div>

      {history.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-lg">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-white/70">History</h2>
            <button
              type="button"
              onClick={() => dispatch({ type: 'HISTORY_CLEAR' })}
              className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-medium text-white/50 transition duration-150 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Clear
            </button>
          </div>
          <ul className="max-h-40 space-y-1 overflow-y-auto">
            {history.map((entry, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'HISTORY_USE', entry })}
                  className="flex w-full items-baseline justify-between gap-3 rounded-lg px-2 py-1 text-right transition duration-150 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <span className="truncate text-xs text-white/40">{entry.expr}</span>
                  <span className="shrink-0 text-sm font-medium text-white/80">{entry.result}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Calculator