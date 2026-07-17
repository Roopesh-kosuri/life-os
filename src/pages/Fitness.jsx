import { useState } from 'react'
import { Calendar, Utensils, Droplets, Moon, Timer, TrendingUp } from 'lucide-react'
import WorkoutSchedule from '../components/fitness/WorkoutSchedule'
import FoodLog from '../components/fitness/FoodLog'
import WaterTracker from '../components/fitness/WaterTracker'
import SleepTracker from '../components/fitness/SleepTracker'
import WorkoutTimer from '../components/fitness/WorkoutTimer'
import FitnessProgress from '../components/fitness/FitnessProgress'
import MusicButtons from '../components/fitness/MusicButtons'
import PageHeader from '../components/ui/PageHeader'
import SectionTabs from '../components/ui/SectionTabs'

const subTabs = [
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'water', label: 'Water', icon: Droplets },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
]

export default function Fitness() {
  const [activeSubTab, setActiveSubTab] = useState('schedule')

  const renderContent = () => {
    switch (activeSubTab) {
      case 'schedule': return <WorkoutSchedule />
      case 'food': return <FoodLog />
      case 'water': return <WaterTracker />
      case 'sleep': return <SleepTracker />
      case 'timer': return <WorkoutTimer />
      case 'progress': return <FitnessProgress />
      default: return <WorkoutSchedule />
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Fitness"
        subtitle="Bulking season — PPL x2 split"
        action={<MusicButtons />}
      />

      <SectionTabs tabs={subTabs} activeTab={activeSubTab} onChange={setActiveSubTab} />

      {/* Content */}
      {renderContent()}
    </div>
  )
}
