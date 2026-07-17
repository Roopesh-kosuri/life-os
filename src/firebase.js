/**
 * Firebase Configuration for LIFE OS
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (or use existing)
 * 3. Enable Firestore Database (start in test mode for dev)
 * 4. Go to Project Settings > General > Your Apps > Web App
 * 5. Copy the firebaseConfig object and paste below
 * 
 * FREE TIER (Spark Plan) LIMITS:
 * - Firestore: 50K reads/day, 20K writes/day, 1GB storage
 * - These are MORE than enough for personal use
 * - The app uses onSnapshot listeners which count as 1 read per document
 *   per listener attachment, then only charges for actual changes
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, query, deleteDoc, updateDoc } from 'firebase/firestore'
import CryptoJS from 'crypto-js'

// ⚠️ REPLACE with your own Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA6EOQmJCCi4FrbU9jiC0Y3Hf3aCPoRpxA",
  authDomain: "life-os-7dd79.firebaseapp.com",
  projectId: "life-os-7dd79",
  storageBucket: "life-os-7dd79.firebasestorage.app",
  messagingSenderId: "914818976353",
  appId: "1:914818976353:web:945f885fbf0c4745f0f820"
}

let app
let db

const isConfigPlaceholder =
  !firebaseConfig.apiKey ||
  firebaseConfig.apiKey.includes('YOUR_API_KEY_HERE') ||
  firebaseConfig.projectId.includes('YOUR_PROJECT_ID');

try {
  if (!isConfigPlaceholder) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } else {
    console.warn('Firebase configuration is placeholder. Running in offline/demo mode.')
  }
} catch (error) {
  console.warn('Firebase initialization failed. Running in offline/demo mode.', error.message)
}

/**
 * Passphrase-based "auth" system
 * 
 * How it works:
 * - User sets a passphrase (e.g. "roopesh2024")
 * - We SHA-256 hash it to create a deterministic user ID
 * - All data lives under /users/{hash}/...
 * - Same passphrase on any device = same data
 * 
 * Security note: This is convenience-focused, not bank-grade.
 * Anyone who knows the passphrase can access the data.
 * For a personal life tracker, this is an acceptable tradeoff.
 */

const PASSPHRASE_KEY = 'lifeos_passphrase_hash'

export function hashPassphrase(phrase) {
  return CryptoJS.SHA256(phrase.trim().toLowerCase()).toString()
}

export function setPassphrase(phrase) {
  const hash = hashPassphrase(phrase)
  localStorage.setItem(PASSPHRASE_KEY, hash)
  localStorage.setItem('lifeos_passphrase_raw', phrase) // for display in settings
  return hash
}

export function getStoredHash() {
  return localStorage.getItem(PASSPHRASE_KEY)
}

export function getStoredPassphrase() {
  return localStorage.getItem('lifeos_passphrase_raw') || ''
}

export function clearAuth() {
  localStorage.removeItem(PASSPHRASE_KEY)
  localStorage.removeItem('lifeos_passphrase_raw')
}

export function isAuthenticated() {
  return !!getStoredHash()
}

/**
 * Get the Firestore path for the current user
 */
export function getUserDocRef() {
  const hash = getStoredHash()
  if (!hash || !db) return null
  return doc(db, 'users', hash)
}

export function getUserSubDocRef(...pathSegments) {
  const hash = getStoredHash()
  if (!hash || !db) return null
  return doc(db, 'users', hash, ...pathSegments)
}

export function getUserCollectionRef(...pathSegments) {
  const hash = getStoredHash()
  if (!hash || !db) return null
  return collection(db, 'users', hash, ...pathSegments)
}

/**
 * Initialize user document in Firestore if it doesn't exist
 */
export async function initializeUserDoc(passphrase) {
  const hash = setPassphrase(passphrase)
  if (!db) return hash

  const userRef = doc(db, 'users', hash)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      createdAt: new Date().toISOString(),
      targets: {
        calories: 2800,
        protein: 140,
        water: 3000,
        sleep: 8
      },
      currentSeason: 'summer',
      productivityGoal: 4,
      groqApiKey: ''
    })
  }

  return hash
}

// Re-export Firestore utilities for use in hooks
export { db, doc, getDoc, setDoc, onSnapshot, collection, query, deleteDoc, updateDoc }
