import { useApp } from '../../context/AppContext'
import { X, Info, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react'

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  ai: Sparkles,
  error: AlertTriangle,
}

const colors = {
  info: 'var(--accent-primary)',
  success: 'var(--status-good)',
  warning: 'var(--status-okay)',
  ai: 'var(--accent-primary)',
  error: 'var(--status-bad)',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useApp()

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90vw] max-w-md pointer-events-none">
      {toasts.map(toast => {
        const Icon = icons[toast.type] || icons.info
        const color = colors[toast.type] || colors.info
        return (
          <div
            key={toast.id}
            className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl shadow-lg p-3.5 flex items-start gap-3 pointer-events-auto"
            style={{
              animation: 'toast-in 0.25s ease-out',
              borderLeft: `3px solid ${color}`,
            }}
          >
            <Icon size={18} style={{ color }} className="shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--text-primary)] flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

