import { useEffect, useRef, useState } from 'react'

function Display({ expression, display, isError }) {
  const [flash, setFlash] = useState(false)
  const textRef = useRef(null)
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

  useEffect(() => {
    const el = textRef.current
    if (!el) return undefined

    const fit = () => {
      el.style.fontSize = ''
      const clientWidth = el.parentElement.clientWidth
      if (el.scrollWidth > clientWidth) {
        const factor = clientWidth / el.scrollWidth
        const current = parseFloat(window.getComputedStyle(el).fontSize)
        el.style.fontSize = `${Math.max(12, Math.floor(current * factor)).toFixed(0)}px`
      }
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el.parentElement)
    return () => observer.disconnect()
  }, [display])

  return (
    <div className="mb-5 flex min-h-20 flex-col items-end justify-end rounded-3xl border-[3px] border-bmo-screen-edge bg-bmo-screen p-4 shadow-[0_4px_0_0_#11251F] sm:min-h-24">
      <div className="flex w-full items-end justify-between gap-2">
        <span className="text-lg leading-none" aria-hidden="true">
          🐰
        </span>
        <p className="flex-1 truncate text-right text-sm font-medium leading-normal text-[#9ECFAD] sm:text-base" aria-hidden="true">
          {expression || '\u00A0'}
        </p>
      </div>
      <p
        ref={textRef}
        aria-live="polite"
        className={
          'font-display w-full whitespace-nowrap text-right text-3xl font-bold leading-normal text-bmo-glow sm:text-4xl md:text-5xl ' +
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