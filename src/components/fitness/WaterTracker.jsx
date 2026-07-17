import { useEffect } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ProgressRing from '../ui/ProgressRing'
import { useDailyDoc } from '../../hooks/useFirestore'
import { useApp } from '../../context/AppContext'
import { getWaterNudge } from '../../services/groq'

export default function WaterTracker() {
  const { profile, addToast, groqApiKey } = useApp()
  const target = profile?.targets?.water || 3000

  const { data: waterData, setData: setWaterData } = useDailyDoc('waterLog', {
    amount: 0,
    target
  })

  const current = waterData.amount || 0

  // Evening nudge — if after 6pm and < 50% of target
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 18 && current < target * 0.5 && groqApiKey) {
      getWaterNudge(current, target, groqApiKey).then(result => {
        if (result.content) {
          addToast(result.content, 'ai', 6000)
        }
      })
    }
  }, []) // Only on mount

  const addWater = async (ml) => {
    const newAmount = current + ml
    await setWaterData({ amount: newAmount, target })
  }

  const quickButtons = [
    { label: '+250ml', value: 250, icon: '🥛' },
    { label: '+500ml', value: 500, icon: '🧊' },
    { label: '+1L', value: 1000, icon: '🫗' },
  ]

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Progress ring */}
      <Card className="p-8 flex flex-col items-center">
        <ProgressRing
          value={current}
          max={target}
          size={150}
          strokeWidth={10}
          color="#3DD9D6"
          sublabel={`${current}ml / ${target}ml`}
        />
        <p className="text-sm text-[var(--text-secondary)] mt-4 font-bold tracking-wide">
          {current >= target 
            ? '✅ TARGET REACHED! STAY HYDRATED.'
            : `${(target - current).toLocaleString()}ml remaining`
          }
        </p>
      </Card>

      {/* Quick add buttons */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Quick Add</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickButtons.map(btn => (
            <Button
              key={btn.value}
              variant="secondary"
              onClick={() => addWater(btn.value)}
              className="flex-col gap-1 py-4 cursor-pointer select-none"
            >
              <span className="text-lg">{btn.icon}</span>
              <span className="text-xs font-semibold">{btn.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Reset */}
      {current > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWaterData({ amount: 0, target })}
          className="self-center"
        >
          Reset today's water
        </Button>
      )}
    </div>
  )
}

