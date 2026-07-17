export default function Card({ children, className = '', variant = 'default', hover = false, onClick, style }) {
  const variants = {
    default: 'card-surface',
    elevated: 'card-surface-elevated',
    inset: 'card-surface-inset',
  }

  return (
    <div
      className={`${variants[variant]} ${hover ? 'hover:border-[var(--accent-primary)] cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}
