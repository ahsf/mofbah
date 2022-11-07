import { createSignal, createEffect, createMemo } from './mofbah/mofbah.mjs'
import { strict as assert } from 'node:assert'

// code from: https://stackoverflow.com/a/61789167/126741
const it = (desc, fn) => {
  try {
    fn()
    console.log('\x1b[32m%s\x1b[0m', `\u2714 it ${desc}`)
  } catch (error) {
    console.log('\n')
    console.log('\x1b[31m%s\x1b[0m', `\u2718 it ${desc}`)
    console.error(error)
  }
}

let effect_ = null

// -- testing signal and effect

const [count, setCount] = createSignal(0)

createEffect(() => (effect_ = count()))
it('should initialize the effect', () => assert.equal(effect_, 0))

setCount(5)
it('should update the effect', () => assert.equal(effect_, 5))

setCount(10)
it('should update the effect again', () => assert.equal(effect_, 10))

// -- testing memo

const [firstName, setFirstName] = createSignal('John')
const [lastName, setLastName] = createSignal('Smith')
const [showFullName, setShowFullName] = createSignal(true)

const displayName = createMemo(() => {
  if (!showFullName()) return firstName()
  return `${firstName()} ${lastName()}`
})

createEffect(() => (effect_ = displayName()))
it('should initialize the memo', () => assert.equal(effect_, 'John Smith'))

setShowFullName(false)
it('should only display the first name', () => assert.equal(effect_, 'John'))

setLastName('Legend')
it('should not change the memo yet', () => assert.equal(effect_, 'John'))

setShowFullName(true)
it('should change the memo now', () => assert.equal(effect_, 'John Legend'))
