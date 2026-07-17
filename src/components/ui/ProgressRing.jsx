import { useId } from 'react'

export default function ProgressRing({ value = 0, max = 100, size = 120, strokeWidth = 8, label, sublabel, color = 'gradient' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(value / max, 1)
  const offset = circumference * (1 - pct)

  const id = useId()
  const gradientId = `ring-grad-${id.replace(/:/g, '')}`

  const isGradient = color === 'gradient'
  const strokeColor = isGradient ? `url(#${gradientId})` : color

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative animate-fade-in" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {isGradient && (
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F7FFF" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          )}
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-main)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </svg>
        {/* Center text */}
        {size >= 50 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span 
              className={`text-2xl font-bold font-display ${isGradient ? 'text-gradient' : ''}`}
              style={!isGradient ? { color } : {}}
            >
              {Math.round(pct * 100)}%
            </span>
            {sublabel && (
              <span className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold tracking-wider uppercase">{sublabel}</span>
            )}
          </div>
        )}
      </div>
      {label && (
        <span className="text-xs text-[var(--text-secondary)] font-semibold">{label}</span>
      )}
    </div>
  )
}

