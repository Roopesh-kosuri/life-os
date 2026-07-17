import { useState } from 'react'
import { Key, Target, Droplets, Moon, Brain, RefreshCw, LogOut, Shield } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input, { Select } from '../components/ui/Input'
import { useApp } from '../context/AppContext'
import { getStoredPassphrase } from '../firebase'
import { useSyncedDoc } from '../hooks/useFirestore'
import { defaultSchedule, seasonOptions } from '../data/defaults'
import PageHeader from '../components/ui/PageHeader'

export default function Settings() {
  const { profile, setProfile, logout, addToast } = useApp()
  const { data: scheduleData, setData: setScheduleData } = useSyncedDoc(
    ['fitness', 'schedule'],
    { days: defaultSchedule, lastResetDate: '' }
  )
  const { data: timeData, setData: setTimeData } = useSyncedDoc(
    ['productivity', 'timeBlocks'],
    { blocks: [] }
  )

  const [apiKey, setApiKey] = useState(profile?.groqApiKey || '')
  const [calories, setCalories] = useState(String(profile?.targets?.calories || 2800))
  const [protein, setProtein] = useState(String(profile?.targets?.protein || 140))
  const [water, setWater] = useState(String(profile?.targets?.water || 3000))
  const [sleep, setSleep] = useState(String(profile?.targets?.sleep || 8))
  const [prodGoal, setProdGoal] = useState(String(profile?.productivityGoal || 4))

  const saveSettings = async () => {
    await setProfile({
      ...profile,
      groqApiKey: apiKey,
      targets: {
        calories: parseInt(calories) || 2800,
        protein: parseInt(protein) || 140,
        water: parseInt(water) || 3000,
        sleep: parseInt(sleep) || 8,
      },
      productivityGoal: parseInt(prodGoal) || 4,
    })
    addToast('Settings saved.', 'success')
  }

  const resetFitnessWeek = async () => {
    const resetDays = (scheduleData.days || defaultSchedule).map(day => ({
      ...day,
      exercises: day.exercises?.map(ex => ({ ...ex, done: false })) || []
    }))
    await setScheduleData({ days: resetDays, lastResetDate: new Date().toISOString().split('T')[0] })
    addToast('Fitness checkboxes reset.', 'success')
  }

  const resetTodayProductivity = async () => {
    await setTimeData({ blocks: [] })
    addToast("Today's time blocks cleared.", 'success')
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <PageHeader title="Settings" subtitle="Configure your LIFE OS" />

      {/* Groq API Key */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Key size={16} className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-semibold">Groq API Key</h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          Get your free key at{' '}
          <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
            console.groq.com/keys
          </a>
          . Powers AI verdicts and chat.
        </p>
        <Input
          type="password"
          placeholder="gsk_..."
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          icon={Key}
        />
      </Card>

      {/* Fitness Targets */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-semibold">Fitness Targets</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Daily Calories"
            type="number"
            value={calories}
            onChange={e => setCalories(e.target.value)}
          />
          <Input
            label="Protein (g)"
            type="number"
            value={protein}
            onChange={e => setProtein(e.target.value)}
          />
          <Input
            label="Water (ml)"
            type="number"
            value={water}
            onChange={e => setWater(e.target.value)}
            icon={Droplets}
          />
          <Input
            label="Sleep (hrs)"
            type="number"
            value={sleep}
            onChange={e => setSleep(e.target.value)}
            icon={Moon}
          />
        </div>
      </Card>

      {/* Productivity */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-semibold">Productivity</h3>
        </div>
        <Input
          label="Daily Productive Hours Goal"
          type="number"
          value={prodGoal}
          onChange={e => setProdGoal(e.target.value)}
        />
      </Card>

      {/* Skincare Season */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Skincare Season</h3>
        <Select
          options={seasonOptions.map(s => ({ value: s.toLowerCase(), label: s }))}
          value={profile?.currentSeason || 'summer'}
          onChange={e => setProfile({ ...profile, currentSeason: e.target.value })}
        />
      </Card>

      {/* Save */}
      <Button onClick={saveSettings} className="w-full">
        Save Settings
      </Button>

      {/* Resets */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <RefreshCw size={16} className="text-[var(--text-secondary)]" />
          Manual Resets
        </h3>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="sm" onClick={resetFitnessWeek} className="w-full justify-start">
            Reset this week's fitness checkboxes
          </Button>
          <Button variant="secondary" size="sm" onClick={resetTodayProductivity} className="w-full justify-start">
            Reset today's productivity log
          </Button>
        </div>
      </Card>

      {/* Account */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Shield size={16} className="text-[var(--text-secondary)]" />
          Account
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          Passphrase: <span className="text-[var(--text-primary)] font-mono bg-[var(--bg-input)] px-2 py-1 rounded border border-[var(--border-main)]">{getStoredPassphrase() || '(hidden)'}</span>
        </p>
        <Button variant="danger" size="sm" onClick={logout} icon={LogOut}>
          Sign Out
        </Button>
      </Card>

      {/* App info */}
      <div className="text-center py-4">
        <p className="text-xs text-[var(--text-secondary)]">
          LIFE OS v1.0 · Built for Roopesh
        </p>
        <p className="text-[10px] text-[var(--text-secondary)] mt-1">
          Free tier: Firebase Spark + Groq Free
        </p>
      </div>
    </div>
  )
}
