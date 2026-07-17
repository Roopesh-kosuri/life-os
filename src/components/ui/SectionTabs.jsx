export default function SectionTabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`-mx-4 mb-6 border-b border-[var(--border-main)] px-4 ${className}`}>
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                relative flex h-11 shrink-0 items-center gap-1.5 px-3 text-xs font-semibold
                whitespace-nowrap transition-colors duration-200 cursor-pointer select-none
                ${isActive ? 'text-transparent bg-gradient-to-r from-[#4F7FFF] to-[#A855F7] bg-clip-text' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
              `}
            >
              <Icon size={14} className={isActive ? 'text-[#4F7FFF]' : ''} />
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-[#4F7FFF] to-[#A855F7]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
