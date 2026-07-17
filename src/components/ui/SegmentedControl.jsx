const sizeStyles = {
  sm: 'min-h-[36px] px-3.5 text-[11px] rounded-lg',
  md: 'min-h-[40px] px-4 text-xs rounded-lg',
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
  scrollable = false,
  inset = false,
}) {
  const segmentSize = sizeStyles[size] || sizeStyles.md

  const control = (
    <div
      className={`inline-flex max-w-full items-center gap-2 ${scrollable ? 'min-w-max' : 'flex-wrap'} ${className}`}
      role="tablist"
    >
      {options.map(option => {
        const isActive = value === option.value
        const Icon = option.icon

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`
              relative inline-flex shrink-0 items-center justify-center gap-1.5 border-2
              ${segmentSize} whitespace-nowrap transition-all duration-200 ease-out cursor-pointer select-none
              ${isActive
                ? 'border-[#5B8AFF] bg-gradient-to-r from-[#4F7FFF] to-[#A855F7] text-white font-semibold shadow-[0_2px_10px_rgba(79,127,255,0.28)]'
                : 'border-[#2A2C33] bg-[rgba(255,255,255,0.04)] text-[var(--text-secondary)] font-medium hover:border-[#3D4048] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {Icon && <Icon size={size === 'sm' ? 13 : 14} />}
            {option.label}
          </button>
        )
      })}
    </div>
  )

  const rowClass = scrollable ? 'pill-row-scroll' : 'pill-row'

  if (inset) {
    return <div className={`${rowClass} w-full`}>{control}</div>
  }

  return <div className="w-full">{control}</div>
}
