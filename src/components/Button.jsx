const VARIANTS = {
  digit: 'bg-white/5 text-white hover:bg-white/10',
  operator: 'bg-blue-500/80 text-white hover:bg-blue-500',
  equals: 'bg-blue-400 text-white hover:bg-blue-300',
  utility: 'bg-white/10 text-white/70 hover:bg-white/15',
  function: 'bg-white/5 text-white/60 hover:bg-white/10',
  toggle: '',
}

function Button({ label, onClick, variant = 'digit', className = '', active = false }) {
  const isEquals = variant === 'equals'
  const variantClass = variant === 'toggle' ? '' : VARIANTS[variant]
  const activeClass = active ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'aspect-square rounded-2xl border border-white/10 text-lg sm:text-xl font-medium',
        'transition duration-150 active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
        'select-none',
        variant === 'toggle' ? activeClass : variantClass,
        isEquals ? 'equals-glow' : '',
        className,
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export default Button