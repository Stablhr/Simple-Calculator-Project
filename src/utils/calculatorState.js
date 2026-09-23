import { evaluateExpression, formatResult } from './calculate.js'

export const DISPLAY_OPS = { '*': '\u00D7', '/': '\u00F7', '-': '\u2212' }
export const OP_CHARS = new Set(['+', '\u00D7', '\u00F7', '\u2212', '*', '/', '-', '^'])

export const initialState = {
  expr: '',
  result: '',
  hasResult: false,
  overwrite: false,
  error: false,
  history: [],
  mode: 'basic',
  angle: 'deg',
}

export function reducer(state, action) {
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