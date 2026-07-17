import { useSyncedDoc } from '../../hooks/useFirestore'
import Card from '../ui/Card'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { defaultCategories } from '../../data/defaults'

export default function ProductivityProgress() {
  const { data: progressData } = useSyncedDoc(['productivity', 'weeklyProgress'], { weeks: [] })

  // Rich demo data if nothing logged yet
  const weeklyData = progressData.weeks?.length > 0
    ? progressData.weeks
    : [
        { day: 'Mon', classes: 3, study: 2, gym: 1.5, gaming: 1, youtube: 1, reading: 0.5 },
        { day: 'Tue', classes: 4, study: 3, gym: 0, gaming: 0.5, youtube: 1.5, reading: 0 },
        { day: 'Wed', classes: 3, study: 2.5, gym: 1.2, gaming: 1, youtube: 0.5, reading: 1 },
        { day: 'Thu', classes: 4, study: 1.5, gym: 1.5, gaming: 0, youtube: 1, reading: 0.5 },
        { day: 'Fri', classes: 2, study: 4, gym: 0, gaming: 2, youtube: 2, reading: 1 },
        { day: 'Sat', classes: 0, study: 5, gym: 1.8, gaming: 3, youtube: 1, reading: 2 },
        { day: 'Sun', classes: 0, study: 3, gym: 0, gaming: 1.5, youtube: 2.5, reading: 1.5 },
      ]

  const chartCategories = defaultCategories.filter(c => !['sleep', 'other'].includes(c.id))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg shadow-lg px-3 py-2 text-xs space-y-1">
        <p className="text-[var(--text-secondary)] font-semibold">{label}</p>
        {payload.filter(p => p.value > 0).map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}h</p>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <Card className="p-4">
        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
          Weekly Time Distribution
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barSize={16}>
              <CartesianGrid stroke="#2A2C33" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v}h`}
              />
              <Tooltip content={<CustomTooltip />} />
              {chartCategories.map(cat => (
                <Bar
                  key={cat.id}
                  dataKey={cat.id}
                  name={cat.name}
                  stackId="a"
                  fill={cat.color}
                  opacity={0.9}
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {progressData.weeks?.length === 0 && (
          <p className="text-xs text-[var(--text-secondary)] text-center mt-2 italic">
            Start logging time blocks to see your weekly distribution here. (Showing demo data)
          </p>
        )}
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {chartCategories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: cat.color }} />
              <span className="text-xs text-[var(--text-secondary)] font-medium">{cat.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

