import { useState, useEffect, useRef } from 'react'
import { Plus, Play, Square, Trash2, Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input, { Select } from '../ui/Input'
import SegmentedControl from '../ui/SegmentedControl'
import { useDailyDoc } from '../../hooks/useFirestore'
import { useApp } from '../../context/AppContext'
import { defaultCategories } from '../../data/defaults'
import { getDailySummary } from '../../services/groq'

export default function TimeBlockTracker() {
  const { addToast, groqApiKey, profile } = useApp()
  const { data: timeData, setData: setTimeData } = useDailyDoc('timeBlocks', { blocks: [] })

  const [category, setCategory] = useState('study')
  const [duration, setDuration] = useState('')
  const [mode, setMode] = useState('manual') // 'manual' or 'timer'
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerStart, setTimerStart] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  const blocks = timeData.blocks || []

  // Live timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - timerStart) / 1000))
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [timerRunning, timerStart])

  const startTimer = () => {
    setTimerStart(Date.now())
    setTimerRunning(true)
    setElapsed(0)
  }

  const stopTimer = async () => {
    clearInterval(timerRef.current)
    setTimerRunning(false)
    const minutes = Math.round(elapsed / 60)
    if (minutes > 0) {
      await addBlock(minutes)
    }
    setElapsed(0)
  }

  const addBlock = async (mins) => {
    const minutes = mins || parseInt(duration)
    if (!minutes || minutes <= 0) return

    const newBlock = {
      id: Date.now(),
      category,
      duration: minutes,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const newBlocks = [...blocks, newBlock]
    await setTimeData({ blocks: newBlocks })
    setDuration('')
  }

  const removeBlock = async (id) => {
    const newBlocks = blocks.filter(b => b.id !== id)
    await setTimeData({ blocks: newBlocks })
  }

  const getVerdict = async () => {
    if (!groqApiKey) {
      addToast('Add your Groq API key in Settings to get AI verdicts.', 'info')
      return
    }
    const categoryTotals = {}
    blocks.forEach(b => {
      const cat = defaultCategories.find(c => c.id === b.category)?.name || b.category
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.round(b.duration / 60 * 10) / 10
    })
    const result = await getDailySummary(categoryTotals, profile?.productivityGoal || 4, groqApiKey)
    if (result.content) addToast(result.content, 'ai', 6000)
  }

  // Category totals
  const categoryTotals = defaultCategories.map(cat => ({
    ...cat,
    minutes: blocks.filter(b => b.category === cat.id).reduce((s, b) => s + b.duration, 0)
  })).filter(c => c.minutes > 0)

  const totalMinutes = blocks.reduce((s, b) => s + b.duration, 0)

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Today's summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Today's Time</h3>
          <span className="text-lg font-bold">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </span>
        </div>
        {categoryTotals.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categoryTotals.map(cat => (
              <span
                key={cat.id}
                className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border-main)] bg-[var(--bg-input)] font-semibold"
                style={{
                  color: cat.color
                }}
              >
                {cat.name}: {cat.minutes}m
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Add block */}
      <Card className="p-4">
        <div className="mb-4">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[
              { value: 'manual', label: 'Manual' },
              { value: 'timer', label: 'Timer' },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="Category"
            options={defaultCategories.map(c => ({ value: c.id, label: c.name }))}
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1"
          />

          {mode === 'manual' ? (
            <>
              <Input
                label="Minutes"
                type="number"
                placeholder="30"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-24"
              />
              <Button onClick={() => addBlock()} icon={Plus} className="mb-0.5">Add</Button>
            </>
          ) : (
            <div className="flex items-end gap-3">
              {timerRunning && (
                <span className="text-lg font-bold text-[var(--accent-primary)] mb-2.5">
                  {formatTime(elapsed)}
                </span>
              )}
              <Button
                onClick={timerRunning ? stopTimer : startTimer}
                icon={timerRunning ? Square : Play}
                variant={timerRunning ? 'danger' : 'primary'}
                className="mb-0.5"
              >
                {timerRunning ? 'Stop' : 'Start'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Blocks list */}
      {blocks.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Log</h3>
            <Button variant="ghost" size="sm" onClick={getVerdict} icon={Sparkles}>
              AI Verdict
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            {blocks.map(block => {
              const cat = defaultCategories.find(c => c.id === block.category)
              return (
                <div key={block.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--bg-input)] border border-transparent hover:border-[var(--border-main)] transition-all group">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat?.color || '#888' }} />
                    <span className="text-sm font-semibold">{cat?.name || block.category}</span>
                    <span className="text-xs text-[var(--text-secondary)]">{block.duration}m · {block.time}</span>
                  </div>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="text-[var(--text-secondary)] hover:text-[var(--status-bad)] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

