import Button from './Button'

export default function EmptyState({ icon: Icon, headline, subtext, ctaLabel = '+ Add products', onAction, className = '' }) {
  return (
    <div className={`flex min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center ${className}`}>
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-main)] bg-[var(--bg-input)] text-[var(--text-tertiary)]">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--text-primary)]">
        {headline}
      </h3>
      {subtext && (
        <p className="mt-1 max-w-[260px] text-sm text-[var(--text-secondary)]">
          {subtext}
        </p>
      )}
      {onAction && (
        <Button className="mt-5" onClick={onAction}>
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
