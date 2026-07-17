import { useState } from 'react'
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'
import Checkbox from '../ui/Checkbox'
import { useSyncedDoc } from '../../hooks/useFirestore'
import { defaultStudyRoadmap } from '../../data/defaults'

export default function StudyRoadmap() {
  const { data: roadmapData, setData: setRoadmapData } = useSyncedDoc(
    ['productivity', 'roadmap'],
    { phases: defaultStudyRoadmap }
  )

  const [expandedPhase, setExpandedPhase] = useState('phase-1')

  const phases = roadmapData.phases || defaultStudyRoadmap

  const toggleItem = async (phaseId, itemId) => {
    const newPhases = phases.map(phase => {
      if (phase.id !== phaseId) return phase
      return {
        ...phase,
        items: phase.items.map(item => 
          item.id === itemId ? { ...item, done: !item.done } : item
        )
      }
    })
    await setRoadmapData({ phases: newPhases })
  }

  // Overall progress
  const totalItems = phases.reduce((s, p) => s + p.items.length, 0)
  const doneItems = phases.reduce((s, p) => s + p.items.filter(i => i.done).length, 0)
  const overallPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Overall progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">AI/ML Study Roadmap</h3>
          <span className="text-sm font-semibold text-[var(--accent-primary)]">{overallPct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--bg-input)] border border-[var(--border-main)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-2">{doneItems}/{totalItems} topics completed · 2nd Year B.Tech CSE AI&ML</p>
      </Card>

      {/* Phase accordion */}
      {phases.map(phase => {
        const isExpanded = expandedPhase === phase.id
        const phaseDone = phase.items.filter(i => i.done).length
        const phaseTotal = phase.items.length
        const phasePct = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0

        return (
          <Card key={phase.id} className="overflow-hidden p-0!">
            {/* Phase header */}
            <button
              onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold select-none
                  ${phasePct === 100 
                    ? 'bg-[var(--status-good)]/20 text-[var(--status-good)]' 
                    : 'bg-[var(--accent-dim)] text-[var(--accent-primary)]'
                  }
                `}>
                  P{phase.phase}
                </div>
                <div>
                  <p className="text-sm font-semibold">{phase.title}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{phase.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 rounded-full bg-[var(--bg-input)] border border-[var(--border-main)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${phasePct}%`,
                        background: phasePct === 100 ? 'var(--status-good)' : 'var(--accent-primary)'
                      }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] font-medium">{phaseDone}/{phaseTotal}</span>
                </div>
                {isExpanded ? <ChevronDown size={14} className="text-[var(--text-secondary)]" /> : <ChevronRight size={14} className="text-[var(--text-secondary)]" />}
              </div>
            </button>

            {/* Phase items */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-[var(--border-main)] pt-3 flex flex-col gap-3">
                {phase.items.map(item => (
                  <div key={item.id} className="flex flex-col gap-1.5 border-b border-[var(--border-main)] last:border-0 pb-3 last:pb-0">
                    <Checkbox
                      checked={item.done}
                      onChange={() => toggleItem(phase.id, item.id)}
                      label={item.title}
                      sublabel={item.description}
                    />
                    {/* Source links */}
                    {item.sources?.length > 0 && (
                      <div className="ml-8 flex flex-wrap gap-1.5">
                        {item.sources.map((source, i) => (
                          <a
                            key={i}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[var(--bg-input)] text-[var(--accent-primary)] border border-[var(--border-main)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors font-semibold"
                          >
                            {source.name}
                            <ExternalLink size={8} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

