import { useSyncedDoc } from '../../hooks/useFirestore'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts'
import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function FitnessProgress() {
  const { data: progressData } = useSyncedDoc(['fitness', 'progressHistory'], { weeks: [] })
  const { data: weightData, setData: setWeightData } = useSyncedDoc(['fitness', 'bodyWeight'], { entries: [] })
  const [newWeight, setNewWeight] = useState('')

  const addWeight = async () => {
    if (!newWeight) return
    const entry = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: parseFloat(newWeight),
      timestamp: Date.now()
    }
    const entries = [...(weightData.entries || []), entry]
    await setWeightData({ entries })
    setNewWeight('')
  }

  // Sample/demo data if no history yet
  const weeklyData = progressData.weeks?.length > 0 
    ? progressData.weeks 
    : [
      { week: 'Week 1', completion: 45 },
      { week: 'Week 2', completion: 60 },
      { week: 'Week 3', completion: 80 },
      { week: 'Week 4', completion: 95 },
    ]

  const weightEntries = weightData.entries || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="text-[var(--text-primary)]">{label}: {payload[0].value}%</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Weekly completion chart */}
      <Card className="p-4">
        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Weekly Workout Completion</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barSize={24}>
              <defs>
                <linearGradient id="fitnessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F7FFF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#2A2C33" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="week" 
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="completion" 
                fill="url(#fitnessGrad)" 
                radius={[6, 6, 0, 0]}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {progressData.weeks?.length === 0 && (
          <p className="text-xs text-[var(--text-secondary)] text-center mt-2 italic">
            Complete workouts to see your progress here. Data updates weekly on Monday. (Showing demo data)
          </p>
        )}
      </Card>

      {/* Body weight chart */}
      <Card className="p-4">
        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Body Weight Log</h3>
        
        {/* Add weight form */}
        <div className="flex gap-2 mb-4">
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addWeight} icon={Plus} size="md">
            Log
          </Button>
        </div>

        {weightEntries.length > 1 ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightEntries.slice(-20)}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F7FFF" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4F7FFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2A2C33" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={v => `${v}kg`}
                />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                  itemStyle={{ color: '#4F7FFF' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#4F7FFF" 
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                  dot={{ fill: '#4F7FFF', r: 3 }}
                  activeDot={{ r: 5, fill: '#4F7FFF' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-secondary)] text-center italic py-4">
            Log at least 2 entries to see the weight trend chart.
          </p>
        )}

        {weightEntries.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {weightEntries.slice(-5).map((e, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-lg bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-primary)]">
                {e.date}: {e.weight}kg
              </span>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

