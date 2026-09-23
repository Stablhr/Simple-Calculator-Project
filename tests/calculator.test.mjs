import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { evaluateExpression, formatResult } from '../src/utils/calculate.js'
import { initialState, reducer } from '../src/utils/calculatorState.js'

function input(state, key) {
  return reducer(state, { type: 'INPUT', key })
}

function op(state, operator) {
  return reducer(state, { type: 'OPERATOR', op: operator })
}

function equals(state) {
  return reducer(state, { type: 'EQUALS' })
}

function display(state) {
  return state.error && state.hasResult ? 'Error' : state.result
}

describe('calculatorState reducer', () => {
  it('number -> operator -> number -> equals', () => {
    let s = input(initialState, '5')
    assert.equal(s.expr, '5')
    assert.equal(s.error, false)

    s = op(s, '+')
    assert.equal(s.expr, '5+')
    assert.equal(s.error, false, 'operator must not trigger evaluation/error')

    s = input(s, '3')
    assert.equal(s.expr, '5+3')

    s = equals(s)
    assert.equal(s.result, '8')
    assert.equal(s.hasResult, true)
    assert.equal(s.error, false)
  })

  it('consecutive operators replace the last one (5 + then x -> 5x, continue -> 35)', () => {
    let s = input(initialState, '5')
    s = op(s, '+')
    s = op(s, '*')
    assert.equal(s.expr, '5\u00D7')
    s = input(s, '7')
    s = equals(s)
    assert.equal(s.result, '35')
  })

  it('stacked same operator collapses (5 + + 3 = 8)', () => {
    let s = input(initialState, '5')
    s = op(s, '+')
    s = op(s, '+')
    s = input(s, '3')
    assert.equal(s.expr, '5+3')
    s = equals(s)
    assert.equal(s.result, '8')
  })

  it('equals with no operator entered (7 = -> 7)', () => {
    let s = input(initialState, '7')
    s = equals(s)
    assert.equal(s.result, '7')
    assert.equal(s.error, false)
  })

  it('equals on empty expression is graceful, not a crash', () => {
    assert.equal(equals(initialState).error, true)
  })

  it('equals right after trailing operator is graceful (5 + =)', () => {
    let s = op(input(initialState, '5'), '+')
    s = equals(s)
    assert.equal(s.error, true)
    assert.equal(display(s), 'Error')
  })

  it('typing after an Error clears it and starts fresh', () => {
    let s = equals(op(input(initialState, '5'), '+'))
    assert.equal(s.error, true)
    s = input(s, '9')
    assert.equal(s.error, false)
    assert.equal(s.expr, '9')
  })

  it('backspace removes last char and stays valid', () => {
    let s = input(initialState, '1')
    s = input(s, '2')
    s = reducer(s, { type: 'BACKSPACE' })
    assert.equal(s.expr, '1')
    assert.equal(s.error, false)
  })
})

describe('evaluateExpression engine', () => {
  const ev = (e, a = 'deg') => evaluateExpression(e, a)

  it('basic arithmetic', () => {
    assert.equal(ev('5+3').value, 8)
    assert.equal(ev('10/4').value, 2.5)
    assert.equal(ev('2*3+4*5').value, 26)
  })

  it('rejects unsafe input (no raw eval)', () => {
    assert.equal(ev('alert(1)').ok, false)
    assert.equal(ev('2+process').ok, false)
  })

  it('scientific operations', () => {
    assert.equal(formatResult(ev('sin(30)').value), '0.5')
    assert.equal(formatResult(ev('tan(45)').value), '1')
    assert.equal(formatResult(ev('sqrt(16)').value), '4')
    assert.equal(formatResult(ev('5!').value), '120')
    assert.equal(formatResult(ev('2^10').value), '1024')
  })

  it('divide by zero returns error (no Infinity leak)', () => {
    const r = ev('1/0')
    assert.equal(r.ok, false)
    assert.equal(formatResult(r.value), '')
  })

  it('cleans floating point artifacts', () => {
    assert.equal(formatResult(ev('0.1+0.2').value), '0.3')
  })
})