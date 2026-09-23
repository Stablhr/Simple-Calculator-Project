import { useEffect, useReducer, useState } from 'react'
import Display from './Display.jsx'
import Keypad from './Keypad.jsx'
import { initialState, reducer } from '../utils/calculatorState.js'

function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [happy, setHappy] = useState(false)
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

  const modeBtn = (m, label) => (
    <button
      type="button"
      onClick={() => dispatch({ type: 'MODE', mode: m })}
      aria-pressed={mode === m}
      className={[
        'flex-1 rounded-full border-[3px] border-[#4E3B31] px-3 py-1 font-display text-xs font-bold uppercase tracking-widest transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A8A] focus-visible:ring-offset-2',
        mode === m
          ? 'translate-y-[1px] bg-butter text-[#4E3B31] shadow-[0_2px_0_0_#4E3B31]'
          : 'bg-white/70 text-[#B089A0] hover:bg-white',
      ].join(' ')}
    >
      {label}
    </button>
  )

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm">
      <div
        className="rounded-[2.5rem] border-[3px] border-[#4E3B31] bg-[#FFF9EE] p-5 sm:p-6"
        style={{ boxShadow: '0 18px 35px -12px rgba(184, 122, 160, 0.45)' }}
      >
        <div className="mb-1 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border-[3px] border-[#4E3B31] bg-white px-4 py-2">
            {happy ? (
              <span className="face-happy inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border-[2px] border-[#4E3B31] bg-[#4E3B31]" />
                <span className="h-1.5 w-3 rounded-b-full border-2 border-t-0 border-[#4E3B31]" />
                <span className="h-2.5 w-2.5 rounded-full border-[2px] border-[#4E3B31] bg-[#4E3B31]" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#4E3B31]" />
                <span className="text-[15px] leading-none text-[#4E3B31]">♡</span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#4E3B31]" />
              </span>
            )}
            <span className="inline-flex items-start gap-1.5">
              <span className="h-2 w-1 rounded-full bg-[#FFB3C8]" />
              <span className="h-2 w-1 rounded-full bg-[#FFB3C8]" />
            </span>
          </div>
        </div>

        <div className="mb-4 mt-3 flex gap-2">{modeBtn('basic', 'Basic')}{modeBtn('scientific', 'Sci')}</div>
        <Display expression={expr} display={displayText} isError={isError} />

        <div className="mb-4 flex justify-between text-xs font-medium text-[#B089A0]">
          <span className="rounded-full bg-white/70 px-2 py-0.5">stress na ko ⊙‿⊙</span>
        </div>

        <Keypad mode={mode} angle={angle} press={handlePress} />
      </div>

      {history.length > 0 && (
        <div className="mt-4 rounded-3xl border-[3px] border-[#4E3B31] bg-[#FFF9EE] p-4 shadow-[0_10px_25px_-10px_rgba(184,122,160,0.45)]">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold tracking-tight text-[#4E3B31]">✦ history</h2>
            <button
              type="button"
              onClick={() => dispatch({ type: 'HISTORY_CLEAR' })}
              className="rounded-lg border-2 border-[#4E3B31] bg-blush px-2 py-1 text-[11px] font-semibold text-[#B06A7E] transition duration-150 hover:bg-blush-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A8A]"
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
                  className="flex w-full items-baseline justify-between gap-3 rounded-xl border-2 border-transparent px-2 py-1 text-right transition duration-150 hover:border-[#4E3B31]/30 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A8A]"
                >
                  <span className="truncate text-xs text-[#B089A0]">{entry.expr}</span>
                  <span className="shrink-0 text-sm font-semibold text-[#4E3B31]">{entry.result}</span>
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