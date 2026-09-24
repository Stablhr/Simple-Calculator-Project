const VARIANTS = {
  digit: 'bg-bmo-digit text-bmo-ink hover:bg-bmo-digit-dark',
  operator: 'bg-bmo-operator text-bmo-ink hover:bg-bmo-operator-dark',
  equals: 'bg-bmo-equals text-bmo-ink hover:bg-bmo-equals-dark',
  utility: 'bg-bmo-utility text-bmo-ink hover:bg-bmo-utility-dark',
  function: 'bg-bmo-func text-bmo-ink hover:bg-bmo-func-dark',
  toggle: '',
}

const STICKER_SHADOW = 'shadow-[0_4px_0_0_#1B2E2A]'

function Button({ label, onClick, variant = 'digit', className = '', active = false, wide = false, compact = false }) {
  const isEquals = variant === 'equals'
  const variantClass = variant === 'toggle' ? '' : VARIANTS[variant]
  const activeClass = active ? 'bg-bmo-equals text-bmo-ink' : 'bg-white/60 text-[#5C7A72] hover:bg-white'

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        wide ? 'aspect-auto' : 'aspect-square',
        compact ? 'text-sm font-semibold' : 'text-lg font-semibold sm:text-xl',
        'rounded-2xl border-[3px] border-bmo-ink',
        'transition-all duration-150 ease-out',
        'active:translate-y-[3px] active:scale-90 active:shadow-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D06B] focus-visible:ring-offset-2',
        'select-none',
        variant === 'toggle' ? activeClass : variantClass,
        variant !== 'toggle' ? STICKER_SHADOW : '',
        isEquals ? 'equals-glow' : '',
        className,
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export default Button