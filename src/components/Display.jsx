import { useEffect, useRef, useState } from 'react'

function Display({ expression, display, angleMode, isError }) {
  const [flash, setFlash] = useState(false)
  const prevDisplay = useRef(display)
  const prevError = useRef(isError)

  useEffect(() => {
    if (display !== prevDisplay.current) {
      prevDisplay.current = display
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 250)
      return () => clearTimeout(t)
    }
    prevDisplay.current = display
    return undefined
  }, [display])

  useEffect(() => {
    if (isError && !prevError.current) {
      prevError.current = isError
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 600)
      return () => clearTimeout(t)
    }
    prevError.current = isError
    return undefined
  }, [isError])

  const angleLabel = angleMode === 'deg' ? 'DEG' : 'RAD'

  return (
    <div className="mb-5 flex h-24 flex-col items-end justify-end overflow-hidden px-2">
      <div className="flex w-full items-end justify-between gap-2">
        <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-white/40 sm:text-xs">
          {angleLabel}
        </span>
        <p className="max-w-[85%] truncate text-right text-sm text-white/40 sm:text-base" aria-hidden="true">
          {expression || '\u00A0'}
        </p>
      </div>
      <p
        aria-live="polite"
        className={
          'w-full overflow-x-auto whitespace-nowrap text-right text-4xl font-semibold text-white sm:text-5xl ' +
          (flash ? 'result-animate ' : '') +
          (isError ? 'text-red-400' : '')
        }
      >
        {display}
      </p>
    </div>
  )
}

export default Display