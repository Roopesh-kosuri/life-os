const headerIcons = {
  Fitness: '🏋️',
  Skincare: '🧴',
  Productivity: '🧠',
  Settings: '⚙️',
}

export default function PageHeader({ title, subtitle, icon, action }) {
  return (
    <header className="flex items-start justify-between gap-4 mb-6">
      <div className="grid min-w-0 grid-cols-[auto_1fr] items-baseline gap-x-2.5">
        <span className="col-start-1 row-start-1 text-[32px] leading-none shrink-0" aria-hidden="true">
            {icon || headerIcons[title]}
        </span>
        <h1 className="col-start-2 row-start-1 font-display text-[32px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle && (
          <p className="col-start-2 mt-1 text-sm font-medium text-[var(--text-secondary)]">
            {subtitle}
          </p>
        )}
        <div className="col-start-2 mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#4F7FFF] to-[#A855F7]" />
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </header>
  )
}
