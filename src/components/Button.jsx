const VARIANTS = {
  digit: 'bg-mint text-[#4E3B31] hover:bg-mint-dark',
  operator: 'bg-butter text-[#4E3B31] hover:bg-butter-dark',
  equals: 'bg-coral text-white hover:bg-coral-dark',
  utility: 'bg-blush text-[#B06A7E] hover:bg-blush-dark',
  function: 'bg-lavender text-[#7C6FB0] hover:bg-lavender-dark',
  toggle: '',
}

const STICKER_SHADOW = 'shadow-[0_4px_0_0_#4E3B31]'

function Button({ label, onClick, variant = 'digit', className = '', active = false, wide = false }) {
  const isEquals = variant === 'equals'
  const variantClass = variant === 'toggle' ? '' : VARIANTS[variant]
  const activeClass = active ? 'bg-yellow-300 text-[#4E3B31]' : 'bg-white/60 text-[#B089A0] hover:bg-white'

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        wide ? 'aspect-auto' : 'aspect-square',
        'rounded-2xl border-[3px] border-[#4E3B31] text-lg font-semibold sm:text-xl',
        'transition-all duration-150 ease-out',
        'active:translate-y-[3px] active:scale-90 active:shadow-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A8A] focus-visible:ring-offset-2',
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