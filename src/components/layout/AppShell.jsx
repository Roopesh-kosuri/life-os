import { useApp } from '../../context/AppContext'
import { Dumbbell, Sparkles, Brain, Settings } from 'lucide-react'
import ToastContainer from '../ui/Toast'

const tabs = [
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'skincare', label: 'Skincare', icon: Sparkles },
  { id: 'productivity', label: 'Productivity', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AppShell({ children }) {
  const { activeTab, setActiveTab } = useApp()

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-[var(--bg-base)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[var(--sidebar-width)] h-[100dvh] sticky top-0 p-4 gap-2 border-r border-[var(--border-main)] bg-[var(--bg-base)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F7FFF] to-[#A855F7] flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_8px_rgba(79,127,255,0.25)]">
            L
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">LIFE OS</h1>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-semibold">Command Center</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-150 relative h-11 select-none cursor-pointer
                  ${isActive
                    ? 'bg-gradient-to-r from-[rgba(79,127,255,0.15)] to-[rgba(168,85,247,0.15)] text-[var(--text-primary)] border-l-2 border-[#4F7FFF]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                <tab.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-[#4F7FFF]' : ''} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-2 text-[10px] text-[var(--text-tertiary)] font-medium">
          v1.0 · Built for Roopesh
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-[100dvh] md:min-h-0 bg-[var(--bg-base)]">
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-nav md:px-8 md:py-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around h-[var(--nav-height-mobile)] px-2 bg-[var(--bg-base)] border-t border-[var(--border-main)] safe-area-pb">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center justify-center gap-1 rounded-xl h-12 w-16
                transition-all duration-150 select-none cursor-pointer
                ${isActive
                  ? 'bg-gradient-to-br from-[rgba(79,127,255,0.12)] to-[rgba(168,85,247,0.12)] text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-secondary)] active:text-[var(--text-primary)]'
                }
              `}
            >
              <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-[#4F7FFF]' : ''} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </nav>

      <ToastContainer />
    </div>
  )
}

