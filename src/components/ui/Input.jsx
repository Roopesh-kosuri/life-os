import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  className = '', 
  error,
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" 
          />
        )}
        <input
          ref={ref}
          type={type}
          className={`input-field min-h-[44px] ${Icon ? '!pl-10' : ''} ${error ? 'border-[var(--status-bad)]!' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-[var(--status-bad)]">{error}</span>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

export function Textarea({ label, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className="input-field resize-none min-h-[88px] py-2.5"
        {...props}
      />
    </div>
  )
}

export function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className="input-field min-h-[44px] appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(242%2C242%2C240%2C0.5)%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_14px_center]"
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
              {opt.label || opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
