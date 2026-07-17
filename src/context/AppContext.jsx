import { createContext, useContext, useState, useEffect } from 'react'
import { isAuthenticated, getStoredHash, getStoredPassphrase, initializeUserDoc, clearAuth } from '../firebase'
import { useSyncedDoc } from '../hooks/useFirestore'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated())
  const [activeTab, setActiveTab] = useState('fitness')
  const [toasts, setToasts] = useState([])

  // User profile synced with Firestore
  const { data: profile, setData: setProfile, loading: profileLoading } = useSyncedDoc(
    ['profile', 'settings'],
    {
      targets: { calories: 2800, protein: 140, water: 3000, sleep: 8 },
      currentSeason: 'summer',
      productivityGoal: 4,
      groqApiKey: ''
    }
  )

  const login = async (passphrase) => {
    await initializeUserDoc(passphrase)
    setAuthed(true)
  }

  const logout = () => {
    clearAuth()
    setAuthed(false)
  }

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <AppContext.Provider value={{
      authed, login, logout,
      activeTab, setActiveTab,
      profile, setProfile, profileLoading,
      toasts, addToast, removeToast,
      groqApiKey: profile?.groqApiKey || ''
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
