const FUNCS = Object.freeze(['sin', 'cos', 'tan', 'ln', 'log', 'sqrt'])

const CONSTANTS = Object.freeze({
  e: Math.E,
  π: Math.PI,
  pi: Math.PI,
})

const OP_TYPES = new Set(['+', '-', '*', '/', '^'])
const END_TYPES = new Set(['num', ')', '!', 'const'])
const START_TYPES = new Set(['num', '(', 'const', 'func'])

function tokenize(raw) {
  const tokens = []
  let i = 0
  while (i < raw.length) {
    const ch = raw[i]
    if (/\s/.test(ch)) {
      i++
      continue
    }
    if (/[0-9.]/.test(ch)) {
      let j = i
      while (j < raw.length && /[0-9.]/.test(raw[j])) j++
      const literal = raw.slice(i, j)
      const dotCount = (literal.match(/\./g) || []).length
      if (dotCount > 1 || !/^\d*\.?\d+$/.test(literal)) {
        throw new Error('invalid number')
      }
      tokens.push({ type: 'num', value: parseFloat(literal) })
      i = j
      continue
    }
    if (/[a-zA-Zπ]/.test(ch)) {
      let j = i
      while (j < raw.length && /[a-zA-Zπ]/.test(raw[j])) j++
      const id = raw.slice(i, j).toLowerCase()
      if (id in CONSTANTS) {
        tokens.push({ type: 'const', id })
      } else if (FUNCS.includes(id)) {
        tokens.push({ type: 'func', id })
      } else {
        throw new Error(`unknown: ${id}`)
      }
      i = j
      continue
    }
    if (OP_TYPES.has(ch) || ch === '!' || ch === '(' || ch === ')') {
      tokens.push({ type: ch })
      i++
      continue
    }
    throw new Error(`unknown: ${ch}`)
  }
  return tokens
}

function addImplicitMultiplication(tokens) {
  const out = []
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    const prev = out[out.length - 1]
    if (prev && END_TYPES.has(prev.type) && START_TYPES.has(t.type)) {
      out.push({ type: '*' })
    }
    out.push(t)
  }
  return out
}

function autoClose(tokens) {
  let depth = 0
  for (const t of tokens) {
    if (t.type === '(') depth++
    if (t.type === ')') depth = Math.max(0, depth - 1)
  }
  for (let i = 0; i < depth; i++) tokens.push({ type: ')' })
  return tokens
}

function toRadians(deg) {
  return (deg * Math.PI) / 180
}

function applyFunc(id, value, angleMode) {
  switch (id) {
    case 'sin':
      return Math.sin(angleMode === 'deg' ? toRadians(value) : value)
    case 'cos':
      return Math.cos(angleMode === 'deg' ? toRadians(value) : value)
    case 'tan':
      return Math.tan(angleMode === 'deg' ? toRadians(value) : value)
    case 'ln':
      return Math.log(value)
    case 'log':
      return Math.log10(value)
    case 'sqrt':
      return Math.sqrt(value)
    default:
      throw new Error('unknown function')
  }
}

function gamma(z) {
  const g = 7
  const C = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  }
  z -= 1
  let x = C[0]
  for (let i = 1; i < g + 2; i++) x += C[i] / (z + i)
  const t = z + g + 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

export function factorial(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) throw new Error('factorial')
  if (n < 0) throw new Error('factorial of negative')
  if (!Number.isInteger(n)) return gamma(n + 1)
  if (n > 170) throw new Error('factorial too large')
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function parse(tokens, angleMode) {
  let pos = 0
  const peek = () => tokens[pos]
  const next = () => tokens[pos++]
  const expect = (type) => {
    if (!peek() || peek().type !== type) throw new Error('expected )')
    next()
  }

  const trig = (id, v) => applyFunc(id, v, angleMode)

  function parseExpr() {
    let left = parseTerm()
    while (peek() && (peek().type === '+' || peek().type === '-')) {
      const op = next().type
      const right = parseTerm()
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  function parseTerm() {
    let left = parseFactor()
    while (peek() && (peek().type === '*' || peek().type === '/')) {
      const op = next().type
      const right = parseFactor()
      if (op === '/') {
        if (right === 0) throw new Error('divide by zero')
        left /= right
      } else {
        left *= right
      }
    }
    return left
  }

  function parseFactor() {
    const base = parseUnary()
    if (peek() && peek().type === '^') {
      next()
      return Math.pow(base, parseFactor())
    }
    return base
  }

  function parseUnary() {
    if (peek() && (peek().type === '-' || peek().type === '+')) {
      const op = next().type
      const v = parseUnary()
      return op === '-' ? -v : v
    }
    return parsePostfix()
  }

  function parsePostfix() {
    let v = parsePrimary()
    while (peek() && peek().type === '!') {
      next()
      v = factorial(v)
    }
    return v
  }

  function parsePrimary() {
    const t = peek()
    if (!t) throw new Error('unexpected end')
    if (t.type === 'num') {
      next()
      return t.value
    }
    if (t.type === 'const') {
      next()
      return CONSTANTS[t.id]
    }
    if (t.type === '(') {
      next()
      const v = parseExpr()
      expect(')')
      return v
    }
    if (t.type === 'func') {
      next()
      if (!peek() || peek().type !== '(') throw new Error('missing (')
      next()
      const inner = parseExpr()
      expect(')')
      return trig(t.id, inner)
    }
    throw new Error('unexpected token')
  }

  const value = parseExpr()
  if (pos !== tokens.length) throw new Error('trailing input')
  return value
}

export function formatResult(raw) {
  if (raw === null || raw === undefined || typeof raw !== 'number') return ''
  if (Number.isNaN(raw) || !Number.isFinite(raw)) return 'Error'
  if (raw === 0) return '0'
  const abs = Math.abs(raw)
  if (abs >= 1e15 || abs < 1e-9) return raw.toExponential(8).replace(/\.?0+e/, 'e')
  return String(parseFloat(raw.toPrecision(12)))
}

export function evaluateExpression(input, angleMode) {
  const text = String(input ?? '').trim()
  if (!text) return { ok: false, value: null, error: null }

  const normalized = text
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'π')
    .replace(/√/g, 'sqrt')

  let tokens
  try {
    tokens = tokenize(normalized)
    tokens = addImplicitMultiplication(tokens)
    tokens = autoClose(tokens)
  } catch {
    return { ok: false, value: null, error: true }
  }

  try {
    const value = parse(tokens, angleMode)
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return { ok: false, value: null, error: true }
    }
    return { ok: true, value, error: null }
  } catch {
    return { ok: false, value: null, error: true }
  }
}