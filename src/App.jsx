import { AppProvider, useApp } from './context/AppContext'
import AppShell from './components/layout/AppShell'
import LoginScreen from './components/auth/LoginScreen'
import Fitness from './pages/Fitness'
import Skincare from './pages/Skincare'
import Productivity from './pages/Productivity'
import Settings from './pages/Settings'

function AppContent() {
  const { authed, activeTab } = useApp()

  if (!authed) {
    return <LoginScreen />
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'fitness': return <Fitness />
      case 'skincare': return <Skincare />
      case 'productivity': return <Productivity />
      case 'settings': return <Settings />
      default: return <Fitness />
    }
  }

  return (
    <AppShell>
      {renderPage()}
    </AppShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
