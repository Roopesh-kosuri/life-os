import { Check } from 'lucide-react'

export default function Checkbox({ checked, onChange, label, sublabel, activeColor = 'gradient', className = '' }) {
  const handleChange = () => {
    onChange(!checked)
  }

  const isGradient = activeColor === 'gradient'

  return (
    <button
      type="button"
      onClick={handleChange}
      className={`flex items-center gap-3 group w-full text-left min-h-[44px] focus:outline-none select-none ${className}`}
    >
      <div
        className={`
          relative flex h-6 w-6 min-w-6 items-center justify-center rounded-md border-[1.5px]
          transition-all duration-150 ease-out shrink-0
          ${checked 
            ? (isGradient 
                ? 'bg-gradient-to-br from-[#4F7FFF] to-[#A855F7] border-transparent text-white animate-check-bounce' 
                : 'text-white') 
            : 'bg-transparent border-[#4A4D57] group-hover:border-[#6B7280]'
          }
        `}
        style={checked && !isGradient ? { backgroundColor: activeColor, borderColor: activeColor } : {}}
      >
        {checked && (
          <Check size={15} strokeWidth={3} className="text-white" />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`text-base font-semibold leading-tight transition-colors duration-150 ${
          checked 
            ? 'text-[var(--text-secondary)] line-through' 
            : 'text-[var(--text-primary)] group-hover:text-[var(--text-primary)]'
        }`}>
          {label}
        </span>
        {sublabel && (
          <span className="mt-1 text-[13px] font-normal leading-tight text-[var(--text-secondary)]">{sublabel}</span>
        )}
      </div>
    </button>
  )
}
