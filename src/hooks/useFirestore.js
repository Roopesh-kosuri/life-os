import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  db, doc, getDoc, setDoc, onSnapshot, 
  getUserSubDocRef, getUserCollectionRef, getStoredHash 
} from '../firebase'
import { collection, query, getDocs, deleteDoc } from 'firebase/firestore'

/**
 * Hook: Subscribe to a single Firestore document with real-time updates
 * Returns [data, setData, loading, error]
 * 
 * When setData is called, it writes to both local state AND Firestore.
 * Uses onSnapshot for real-time sync across devices.
 */
export function useSyncedDoc(pathSegments, defaultValue = {}) {
  const pathKey = pathSegments.join('/')
  const localStorageKey = `lifeos_cache_${pathKey}`

  // Initialize from localStorage fallback if available to avoid layout shift
  const [data, setDataLocal] = useState(() => {
    try {
      const cached = localStorage.getItem(localStorageKey)
      return cached ? JSON.parse(cached) : defaultValue
    } catch {
      return defaultValue
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const hash = getStoredHash()
    if (!hash || !db) {
      setLoading(false)
      setIsOffline(true)
      return
    }

    const docRef = doc(db, 'users', hash, ...pathSegments)

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const snapData = snapshot.data()
          setDataLocal(snapData)
          try {
            localStorage.setItem(localStorageKey, JSON.stringify(snapData))
          } catch {}
        } else {
          // Document doesn't exist yet, create with defaults (or cache if available)
          let initialData = defaultValue
          try {
            const cached = localStorage.getItem(localStorageKey)
            if (cached) initialData = JSON.parse(cached)
          } catch {}
          setDoc(docRef, initialData, { merge: true }).catch(console.error)
          setDataLocal(initialData)
        }
        setLoading(false)
        setIsOffline(false)
      },
      (err) => {
        console.warn(`Firestore listener error for ${pathKey}:`, err.message)
        setError(err)
        setIsOffline(true)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [pathKey, localStorageKey])

  const setData = useCallback(async (newDataOrUpdater) => {
    const hash = getStoredHash()
    if (!hash) return

    const newData = typeof newDataOrUpdater === 'function' 
      ? newDataOrUpdater(data) 
      : newDataOrUpdater

    setDataLocal(newData)
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(newData))
    } catch (e) {
      console.warn('Failed to save to localStorage:', e)
    }

    if (db) {
      try {
        const docRef = doc(db, 'users', hash, ...pathSegments)
        await setDoc(docRef, newData, { merge: true })
      } catch (err) {
        console.warn('Failed to sync to Firestore:', err.message)
        setIsOffline(true)
      }
    }
  }, [data, pathKey, localStorageKey])

  return { data, setData, loading, error, isOffline }
}

/**
 * Hook: Get today's date string for daily-scoped documents
 */
export function useTodayKey() {
  const [today, setToday] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })

  useEffect(() => {
    // Check every minute if the date has changed (midnight rollover)
    const interval = setInterval(() => {
      const d = new Date()
      const newToday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (newToday !== today) {
        setToday(newToday)
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [today])

  return today
}

/**
 * Hook: Subscribe to a daily-scoped document (e.g., food log for today)
 */
export function useDailyDoc(collectionName, defaultValue = {}) {
  const today = useTodayKey()
  return { 
    ...useSyncedDoc([collectionName, today], defaultValue),
    today 
  }
}

/**
 * Hook: Get the current week key (Monday-based)
 */
export function useWeekKey() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  const monday = new Date(d.setDate(diff))
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`
}
