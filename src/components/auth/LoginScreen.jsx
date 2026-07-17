import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Lock, ArrowRight } from 'lucide-react'

export default function LoginScreen() {
  const { login } = useApp()
  const [passphrase, setPassphrase] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (passphrase.trim().length < 3) {
      setError('Passphrase must be at least 3 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(passphrase.trim())
    } catch (err) {
      setError('Failed to connect. Check your Firebase config and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-[var(--bg-base)]">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center text-[var(--text-primary)] text-2xl font-bold mb-4">
            L
          </div>
          <h1 className="text-3xl font-bold tracking-tight">LIFE OS</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Personal Command Center</p>
        </div>

        <Card variant="elevated" className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold mb-1">Enter your passphrase</h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Use the same passphrase on all your devices to sync data. 
                First time? Just pick one and remember it.
              </p>
            </div>

            <Input
              type="password"
              placeholder="e.g. mylifeos2024"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              icon={Lock}
              error={error}
              autoFocus
            />

            <Button type="submit" loading={loading} className="w-full">
              <span>Enter LIFE OS</span>
              <ArrowRight size={16} />
            </Button>

            <p className="text-[10px] text-[var(--text-secondary)] text-center leading-relaxed">
              Your passphrase is hashed locally. Same phrase = same data on any device.
              This is not bank-grade security — it's convenience-focused for personal use.
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}

