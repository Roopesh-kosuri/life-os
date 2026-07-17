import { useState } from 'react'
import { Moon, Sun, Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ProgressRing from '../ui/ProgressRing'
import { useDailyDoc, useSyncedDoc } from '../../hooks/useFirestore'
import { useApp } from '../../context/AppContext'
import { getSleepComment } from '../../services/groq'

export default function SleepTracker() {
  const { profile, addToast, groqApiKey } = useApp()
  const target = profile?.targets?.sleep || 8

  const { data: sleepData, setData: setSleepData } = useDailyDoc('sleepLog', {
    bedtime: '',
    wakeTime: '',
    hours: 0,
    rating: ''
  })

  const { data: historyData } = useSyncedDoc(['fitness', 'sleepHistory'], { entries: [] })

  const [bedtime, setBedtime] = useState(sleepData.bedtime || '')
  const [wakeTime, setWakeTime] = useState(sleepData.wakeTime || '')
  const [loading, setLoading] = useState(false)

  const calculateHours = (bed, wake) => {
    if (!bed || !wake) return 0
    const [bedH, bedM] = bed.split(':').map(Number)
    const [wakeH, wakeM] = wake.split(':').map(Number)
    let bedMinutes = bedH * 60 + bedM
    let wakeMinutes = wakeH * 60 + wakeM
    if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60 // next day
    return Math.round(((wakeMinutes - bedMinutes) / 60) * 10) / 10
  }

  const getRating = (hours) => {
    if (hours >= 7 && hours <= 9) return { label: 'Good', color: 'var(--status-good)', emoji: '😴' }
    if (hours >= 6 && hours < 7) return { label: 'Okay', color: 'var(--status-okay)', emoji: '😐' }
    return { label: 'Bad', color: 'var(--status-bad)', emoji: '💀' }
  }

  const logSleep = async () => {
    const hours = calculateHours(bedtime, wakeTime)
    if (hours <= 0) return

    const rating = getRating(hours)
    const entry = { bedtime, wakeTime, hours, rating: rating.label }
    await setSleepData(entry)

    // Get AI comment
    if (groqApiKey) {
      setLoading(true)
      const result = await getSleepComment(hours, groqApiKey)
      setLoading(false)
      if (result.content) {
        addToast(result.content, 'ai', 5000)
      }
    }
  }

  const hours = sleepData.hours || calculateHours(bedtime, wakeTime)
  const rating = hours > 0 ? getRating(hours) : null

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Current sleep status */}
      {sleepData.hours > 0 && (
        <Card className="p-6 flex flex-col items-center">
          <ProgressRing
            value={sleepData.hours}
            max={target}
            size={140}
            strokeWidth={9}
            color="#7C8CFF"
            sublabel="Sleep"
          />
          <p className="text-sm mt-4 font-bold tracking-wide" style={{ color: rating?.color }}>
            {rating?.emoji} {rating?.label.toUpperCase()} · {sleepData.bedtime} → {sleepData.wakeTime}
          </p>
        </Card>
      )}

      {/* Log form */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
          {sleepData.hours > 0 ? 'Update Sleep Log' : 'Log Last Night\'s Sleep'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Input
            label="Bedtime"
            type="time"
            value={bedtime}
            onChange={e => setBedtime(e.target.value)}
            icon={Moon}
          />
          <Input
            label="Wake Time"
            type="time"
            value={wakeTime}
            onChange={e => setWakeTime(e.target.value)}
            icon={Sun}
          />
        </div>
        {bedtime && wakeTime && (
          <p className="text-xs text-[var(--text-secondary)] mb-3 text-center">
            = {calculateHours(bedtime, wakeTime)} hours of sleep
          </p>
        )}
        <Button onClick={logSleep} loading={loading} className="w-full" icon={Sparkles}>
          Log Sleep
        </Button>
      </Card>

      {/* Recent history */}
      {(historyData.entries?.length > 0) && (
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Last 7 Days</h3>
          <div className="flex items-end justify-between gap-2 h-24">
            {(historyData.entries || []).slice(-7).map((entry, i) => {
              const h = entry.hours || 0
              const r = getRating(h)
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-[var(--text-secondary)]">{h}h</span>
                  <div
                    className="w-full rounded-t-md min-h-[4px] transition-all duration-500"
                    style={{
                      height: `${Math.max((h / 10) * 100, 8)}%`,
                      background: r.color
                    }}
                  />
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

