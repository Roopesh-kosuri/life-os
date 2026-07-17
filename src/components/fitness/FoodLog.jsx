import { useState } from 'react'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ProgressRing from '../ui/ProgressRing'
import { useDailyDoc } from '../../hooks/useFirestore'
import { useApp } from '../../context/AppContext'
import { getFoodVerdict } from '../../services/groq'

export default function FoodLog() {
  const { profile, addToast, groqApiKey } = useApp()
  const targets = profile?.targets || { calories: 2800, protein: 140 }
  
  const { data: foodData, setData: setFoodData } = useDailyDoc('foodLog', {
    meals: [],
    totals: { calories: 0, protein: 0 }
  })

  const [mealName, setMealName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  const meals = foodData.meals || []
  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + (m.calories || 0),
    protein: acc.protein + (m.protein || 0)
  }), { calories: 0, protein: 0 })

  const addMeal = async () => {
    if (!mealName.trim()) return

    const newMeal = {
      id: Date.now(),
      name: mealName.trim(),
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const newMeals = [...meals, newMeal]
    const newTotals = {
      calories: totals.calories + newMeal.calories,
      protein: totals.protein + newMeal.protein
    }

    await setFoodData({ meals: newMeals, totals: newTotals })

    setMealName('')
    setCalories('')
    setProtein('')

    // Get AI verdict
    if (groqApiKey) {
      setLoadingAI(true)
      const result = await getFoodVerdict(newTotals, targets, groqApiKey)
      setLoadingAI(false)
      if (result.content) {
        addToast(result.content, 'ai', 5000)
      }
    }
  }

  const removeMeal = async (id) => {
    const newMeals = meals.filter(m => m.id !== id)
    const newTotals = newMeals.reduce((acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0)
    }), { calories: 0, protein: 0 })
    await setFoodData({ meals: newMeals, totals: newTotals })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Macro targets */}
      <Card className="p-5">
        <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Today's Macros</h3>
        <div className="flex flex-col sm:flex-row justify-around items-center gap-6 py-2">
          {/* Calories Ring */}
          <ProgressRing
            value={totals.calories}
            max={targets.calories}
            size={120}
            strokeWidth={9}
            color="#FF8A4C" // warm orange
            label="Calories"
            sublabel={`${totals.calories.toLocaleString()} / ${targets.calories.toLocaleString()} kcal`}
          />
          {/* Protein Ring */}
          <ProgressRing
            value={totals.protein}
            max={targets.protein}
            size={120}
            strokeWidth={9}
            color="#7C8CFF" // soft indigo
            label="Protein"
            sublabel={`${totals.protein}g / ${targets.protein}g`}
          />
        </div>
      </Card>

      {/* Add meal form */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Log Meal</h3>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Meal name (e.g. Chicken rice bowl)"
            value={mealName}
            onChange={e => setMealName(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={e => setCalories(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Protein (g)"
              value={protein}
              onChange={e => setProtein(e.target.value)}
            />
          </div>
          <Button onClick={addMeal} icon={Plus} loading={loadingAI}>
            Log Meal {groqApiKey && <Sparkles size={12} className="ml-1 opacity-50" />}
          </Button>
        </div>
      </Card>

      {/* Meals list */}
      {meals.length > 0 && (
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Today's Meals ({meals.length})
          </h3>
          <div className="flex flex-col gap-2">
            {meals.map(meal => (
              <div key={meal.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-main)] group">
                <div>
                  <p className="text-sm font-medium">{meal.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {meal.calories} cal · {meal.protein}g protein · {meal.time}
                  </p>
                </div>
                <button
                  onClick={() => removeMeal(meal.id)}
                  className="text-[var(--text-secondary)] hover:text-[var(--status-bad)] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

