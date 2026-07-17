import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function WorkoutTimer() {
  const [duration, setDuration] = useState(90) // seconds
  const [remaining, setRemaining] = useState(90)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)

  const presets = [60, 90, 120, 180]

  const playBeep = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.value = 880
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch (e) {
      console.warn('Audio not supported')
    }
  }, [])

  const vibrate = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200])
    }
  }, [])

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            setIsComplete(true)
            playBeep()
            vibrate()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, playBeep, vibrate])

  const toggleTimer = () => {
    if (isComplete) {
      reset()
      return
    }
    setIsRunning(!isRunning)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setIsComplete(false)
    setRemaining(duration)
  }

  const selectPreset = (seconds) => {
    setDuration(seconds)
    setRemaining(seconds)
    setIsRunning(false)
    setIsComplete(false)
    clearInterval(intervalRef.current)
  }

  const pct = remaining / duration
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  // SVG circle props
  const size = 240
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in-up">
      {/* Timer ring */}
      <Card className="p-8 flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--border-main)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={isComplete ? 'var(--status-good)' : 'var(--accent-primary)'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: 'stroke-dashoffset 0.3s ease-out'
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-semibold tracking-tight ${
              isComplete ? 'text-[var(--status-good)]' : 'text-[var(--text-primary)]'
            }`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-[var(--text-secondary)] mt-1 font-semibold">
              {isComplete ? 'REST COMPLETE' : isRunning ? 'RESTING' : 'TAP TO START'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="w-12 h-12 rounded-full cursor-pointer"
          >
            <RotateCcw size={20} />
          </Button>

          <button
            onClick={toggleTimer}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center cursor-pointer select-none
              transition-all duration-200 active:scale-95 border border-[rgba(255,255,255,0.1)]
              ${isComplete 
                ? 'bg-[var(--status-good)] text-[var(--bg-base)]' 
                : 'bg-[var(--accent-primary)] text-[var(--text-primary)]'
              }
            `}
          >
            {isComplete ? (
              <RotateCcw size={24} />
            ) : isRunning ? (
              <Pause size={24} />
            ) : (
              <Play size={24} className="ml-1" />
            )}
          </button>

          <div className="w-12 h-12" /> {/* spacer for symmetry */}
        </div>
      </Card>

      {/* Presets */}
      <Card className="p-4 w-full">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Rest Duration</h3>
        <div className="grid grid-cols-4 gap-2">
          {presets.map(sec => (
            <Button
              key={sec}
              variant={duration === sec ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => selectPreset(sec)}
            >
              {sec < 60 ? `${sec}s` : `${sec / 60}m${sec % 60 ? ` ${sec % 60}s` : ''}`}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}

