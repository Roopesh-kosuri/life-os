import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'
import Checkbox from '../ui/Checkbox'
import ProgressRing from '../ui/ProgressRing'
import { useSyncedDoc } from '../../hooks/useFirestore'
import { defaultSchedule } from '../../data/defaults'

function ExerciseChecklistRow({ exercise, checked, onToggle, activeColor = 'gradient' }) {
  return (
    <div className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-[#2A2C33] bg-[#1A1B20] px-4 py-4 transition-colors duration-150 hover:border-[#3A3B40]">
      <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#4F7FFF] to-[#A855F7]" aria-hidden="true" />
      <Checkbox
        checked={checked}
        onChange={onToggle}
        label={exercise.name}
        sublabel={`${exercise.sets} × ${exercise.reps}`}
        activeColor={activeColor}
        className="pl-1"
      />
      <a
        href={exercise.youtubeSearchQuery}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-3 shrink-0 text-[var(--text-secondary)] opacity-70 transition-colors hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
        title="Watch form video"
      >
        <ExternalLink size={14} />
      </a>
    </div>
  )
}

export default function WorkoutSchedule() {
  const today = new Date().getDay() // 0=Sun, 1=Mon...
  const todayIndex = today === 0 ? 6 : today - 1 // Convert to 0=Mon...6=Sun

  const { data: schedule, setData: setSchedule, loading } = useSyncedDoc(
    ['fitness', 'schedule'],
    { days: defaultSchedule, lastResetDate: '' }
  )

  const [expandedDay, setExpandedDay] = useState(-1) // Start all collapsed in weekly view since today is hero

  // Weekly reset logic — check if it's Monday and we haven't reset yet this week
  useEffect(() => {
    if (!schedule.days || schedule.lastResetDate === undefined) return
    
    const now = new Date()
    const isMonday = now.getDay() === 1
    const todayStr = now.toISOString().split('T')[0]
    
    if (isMonday && schedule.lastResetDate !== todayStr) {
      const resetDays = schedule.days.map(day => ({
        ...day,
        exercises: day.exercises?.map(ex => ({ ...ex, done: false })) || []
      }))
      
      setSchedule({ days: resetDays, lastResetDate: todayStr })
    }
  }, [schedule])

  const toggleExercise = (dayIndex, exerciseIndex) => {
    const newDays = [...(schedule.days || defaultSchedule)]
    const newExercises = [...newDays[dayIndex].exercises]
    newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], done: !newExercises[exerciseIndex].done }
    newDays[dayIndex] = { ...newDays[dayIndex], exercises: newExercises }
    setSchedule({ ...schedule, days: newDays })
  }

  const days = schedule.days || defaultSchedule
  const todayDay = days[todayIndex] || { dayName: 'Today', label: 'Workout', focus: 'Rest', isRest: true, exercises: [] }
  const todayCompletedCount = todayDay.exercises?.filter(e => e.done).length || 0
  const todayTotalCount = todayDay.exercises?.length || 0
  const todayPct = todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0

  if (loading) {
    return <div className="text-center text-[var(--text-secondary)] py-12">Loading schedule...</div>
  }

  return (
    <div className="flex flex-col gap-6 stagger-children animate-fade-in-up">
      {/* TODAY'S WORKOUT HERO CARD */}
      <Card className="bg-hero-gradient p-5 md:p-6 relative overflow-hidden border border-[var(--border-main)] rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex-1 space-y-3 min-w-0 w-full">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-[#4F7FFF]/20 to-[#A855F7]/20 border border-[#4F7FFF]/30 text-[#4F7FFF] font-extrabold tracking-wider uppercase">
                Today's Workout
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-bold tracking-wider">
                {todayDay.dayName.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">{todayDay.label}</h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 uppercase tracking-wider">{todayDay.focus}</p>
            </div>
            
            {todayDay.isRest ? (
              <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed pt-2 font-medium">{todayDay.restMessage}</p>
            ) : (
              <div className="flex gap-5 pt-2">
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold font-display text-gradient">{todayCompletedCount} / {todayTotalCount}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-wide uppercase mt-1">Exercises Done</p>
                </div>
                <div className="border-l border-[var(--border-main)] pl-5">
                  <p className="text-2xl md:text-3xl font-extrabold font-display text-gradient">{todayPct}%</p>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-wide uppercase mt-1">Completed</p>
                </div>
              </div>
            )}
          </div>
          
          {!todayDay.isRest && todayTotalCount > 0 && (
            <div className="shrink-0">
              <ProgressRing
                value={todayCompletedCount}
                max={todayTotalCount}
                size={110}
                strokeWidth={9}
                color="gradient"
                sublabel="Workout"
              />
            </div>
          )}
        </div>

        {/* Exercises list for today directly inside the hero card */}
        {!todayDay.isRest && todayDay.exercises?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[var(--border-main)] flex flex-col gap-2.5">
            <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Workout Checklist</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {todayDay.exercises.map((exercise, exIndex) => (
                <ExerciseChecklistRow
                  key={exercise.id}
                  exercise={exercise}
                  checked={exercise.done}
                  onToggle={() => toggleExercise(todayIndex, exIndex)}
                  activeColor="gradient"
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* WEEKLY SCHEDULE */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Weekly Plan</h3>
        <div className="flex flex-col gap-3">
          {days.map((day, dayIndex) => {
            const isToday = dayIndex === todayIndex
            const isExpanded = expandedDay === dayIndex
            const completedCount = day.exercises?.filter(e => e.done).length || 0
            const totalCount = day.exercises?.length || 0
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

            return (
              <Card
                key={day.dayNumber}
                className={`overflow-hidden transition-all duration-150 ${
                  isToday ? 'border-[#4F7FFF]/40 bg-[rgba(79,127,255,0.02)]' : ''
                }`}
              >
                {/* Day header */}
                <button
                  onClick={() => setExpandedDay(isExpanded ? -1 : dayIndex)}
                  className="w-full flex items-center justify-between p-4 text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold select-none transition-all
                      ${isToday 
                        ? 'bg-gradient-to-br from-[#4F7FFF] to-[#A855F7] text-white shadow-md' 
                        : 'bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-secondary)]'
                      }
                    `}>
                      {day.dayName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm font-display">{day.label}</span>
                        {isToday && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#4F7FFF]/20 to-[#A855F7]/20 border border-[#4F7FFF]/30 text-[#4F7FFF] font-extrabold uppercase tracking-wide">
                            TODAY
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">{day.focus}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!day.isRest && totalCount > 0 && (
                      <div className="flex items-center gap-2">
                        <ProgressRing
                          value={completedCount}
                          max={totalCount}
                          size={24}
                          strokeWidth={3.5}
                          color={pct === 100 ? 'var(--status-good)' : '#4F7FFF'}
                        />
                        <span className="text-xs text-[var(--text-secondary)] w-8 text-right font-bold">{pct}%</span>
                      </div>
                    )}
                    {isExpanded ? <ChevronUp size={16} className="text-[var(--text-secondary)]" /> : <ChevronDown size={16} className="text-[var(--text-secondary)]" />}
                  </div>
                </button>

                {/* Exercise list */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[var(--border-main)]">
                    {day.isRest ? (
                      <div className="py-6 text-center">
                        <p className="text-sm text-[var(--text-secondary)] italic font-semibold">{day.restMessage}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5 pt-3">
                        {day.exercises?.map((exercise, exIndex) => (
                          <ExerciseChecklistRow
                            key={exercise.id}
                            exercise={exercise}
                            checked={exercise.done}
                            onToggle={() => toggleExercise(dayIndex, exIndex)}
                            activeColor={isToday ? 'gradient' : '#4F7FFF'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
