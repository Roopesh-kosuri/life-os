import { Loader2 } from 'lucide-react'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-[14px]
    transition-all duration-150 ease-out
    disabled:opacity-40 disabled:cursor-not-allowed
    active:scale-[0.95] select-none
  `
  
  const variants = {
    primary: `
      bg-gradient-to-r from-[#4F7FFF] to-[#A855F7] text-white
      hover:opacity-90 hover:shadow-[0_4px_12px_rgba(79,127,255,0.15)]
      border border-transparent
    `,
    gradient: `
      bg-gradient-to-r from-[#4F7FFF] to-[#A855F7] text-white
      hover:opacity-90 hover:shadow-[0_4px_12px_rgba(79,127,255,0.15)]
      border border-transparent
    `,
    secondary: `
      bg-[var(--bg-surface)] text-[var(--text-primary)]
      hover:bg-[var(--bg-input)] hover:border-[#3A3B40]
      border border-[var(--border-main)]
    `,
    ghost: `
      bg-transparent text-[var(--text-secondary)]
      hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]
      border border-transparent
    `,
    danger: `
      bg-[rgba(248,113,113,0.1)] text-[#F87171]
      hover:bg-[rgba(248,113,113,0.18)]
      border border-[rgba(248,113,113,0.2)]
    `,
    accent: `
      bg-[var(--bg-surface)] text-[var(--accent-primary)]
      hover:bg-[var(--bg-input)]
      border border-[var(--border-main)]
    `,
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs min-h-[36px]',
    md: 'px-4 py-2 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
    icon: 'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 18} />
      ) : null}
      {children}
    </button>
  )
}
