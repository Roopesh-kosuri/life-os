import { useState } from 'react'
import { Clock, CheckSquare, BookOpen, MessageCircle, TrendingUp } from 'lucide-react'
import TimeBlockTracker from '../components/productivity/TimeBlockTracker'
import TodoList from '../components/productivity/TodoList'
import StudyRoadmap from '../components/productivity/StudyRoadmap'
import AIChat from '../components/productivity/AIChat'
import ProductivityProgress from '../components/productivity/ProductivityProgress'
import PageHeader from '../components/ui/PageHeader'
import SectionTabs from '../components/ui/SectionTabs'

const subTabs = [
  { id: 'time', label: 'Time', icon: Clock },
  { id: 'todos', label: 'Todos', icon: CheckSquare },
  { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
  { id: 'chat', label: 'AI Chat', icon: MessageCircle },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
]

export default function Productivity() {
  const [activeSubTab, setActiveSubTab] = useState('time')

  const renderContent = () => {
    switch (activeSubTab) {
      case 'time': return <TimeBlockTracker />
      case 'todos': return <TodoList />
      case 'roadmap': return <StudyRoadmap />
      case 'chat': return <AIChat />
      case 'progress': return <ProductivityProgress />
      default: return <TimeBlockTracker />
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Productivity"
        subtitle="Study · Gaming · YouTube · Reading"
      />

      <SectionTabs tabs={subTabs} activeTab={activeSubTab} onChange={setActiveSubTab} />

      {renderContent()}
    </div>
  )
}
