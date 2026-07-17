import { useState } from 'react'
import { Plus, Edit2, Trash2, Sun, Moon, Package } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input, { Select } from '../components/ui/Input'
import Checkbox from '../components/ui/Checkbox'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import SegmentedControl from '../components/ui/SegmentedControl'
import { useSyncedDoc, useDailyDoc } from '../hooks/useFirestore'
import { useApp } from '../context/AppContext'
import { skincareCategories, seasonOptions } from '../data/defaults'

export default function Skincare() {
  const { profile, setProfile } = useApp()
  const currentSeason = profile?.currentSeason || 'Summer'

  const { data: productsData, setData: setProductsData } = useSyncedDoc(
    ['skincare', 'products'],
    { items: [] }
  )

  const { data: dailyLog, setData: setDailyLog } = useDailyDoc('skincareLog', {
    amCompleted: [],
    pmCompleted: [],
    amDone: false,
    pmDone: false
  })

  const [view, setView] = useState('today') // 'today' or 'all'
  const [timeOfDay, setTimeOfDay] = useState(() => new Date().getHours() < 14 ? 'AM' : 'PM')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({
    name: '', category: 'Cleanser', season: 'All-Season', timeOfDay: 'Both', notes: '', active: true
  })

  const products = productsData.items || []

  // Filter for today's routine
  const todayProducts = products.filter(p => {
    if (!p.active) return false
    const seasonMatch = p.season === 'All-Season' || p.season?.toLowerCase() === currentSeason?.toLowerCase()
    const timeMatch = p.timeOfDay === 'Both' || p.timeOfDay === timeOfDay
    return seasonMatch && timeMatch
  })

  const saveProduct = async () => {
    if (!form.name.trim()) return
    
    let newItems
    if (editingProduct !== null) {
      newItems = products.map((p, i) => i === editingProduct ? { ...form, id: p.id } : p)
    } else {
      newItems = [...products, { ...form, id: Date.now() }]
    }

    await setProductsData({ items: newItems })
    setForm({ name: '', category: 'Cleanser', season: 'All-Season', timeOfDay: 'Both', notes: '', active: true })
    setShowForm(false)
    setEditingProduct(null)
  }

  const deleteProduct = async (index) => {
    const newItems = products.filter((_, i) => i !== index)
    await setProductsData({ items: newItems })
  }

  const editProduct = (index) => {
    setForm(products[index])
    setEditingProduct(index)
    setShowForm(true)
  }

  const toggleProductDone = async (productId) => {
    const key = timeOfDay === 'AM' ? 'amCompleted' : 'pmCompleted'
    const completed = dailyLog[key] || []
    const newCompleted = completed.includes(productId)
      ? completed.filter(id => id !== productId)
      : [...completed, productId]
    
    const allDone = todayProducts.every(p => newCompleted.includes(p.id))
    
    await setDailyLog({
      ...dailyLog,
      [key]: newCompleted,
      [`${timeOfDay.toLowerCase()}Done`]: allDone
    })
  }

  const completedList = timeOfDay === 'AM' ? (dailyLog.amCompleted || []) : (dailyLog.pmCompleted || [])
  const seasonValue = currentSeason?.toLowerCase()

  return (
    <div className="animate-fade-in">
      <PageHeader title="Skincare" subtitle="Looks-maxing routine tracker" />

      {/* View toggle + Season */}
      <div className="mb-4 flex flex-col gap-3">
        <SegmentedControl
          inset
          value={view}
          onChange={setView}
          options={[
            { value: 'today', label: "Today's Routine" },
            { value: 'all', label: 'All Products', icon: Package },
          ]}
        />

        <SegmentedControl
          inset
          size="sm"
          scrollable
          value={seasonValue}
          onChange={(season) => setProfile({ ...profile, currentSeason: season })}
          options={seasonOptions.map(s => ({ value: s.toLowerCase(), label: s }))}
        />
      </div>

      {view === 'today' ? (
        <>
          {/* AM/PM Toggle */}
          <div className="mb-4">
            <SegmentedControl
              inset
              value={timeOfDay}
              onChange={setTimeOfDay}
              options={[
                { value: 'AM', label: `Morning${dailyLog.amDone ? ' ✓' : ''}`, icon: Sun },
                { value: 'PM', label: `Evening${dailyLog.pmDone ? ' ✓' : ''}`, icon: Moon },
              ]}
            />
          </div>

          {/* Today's products checklist */}
          <Card className="overflow-hidden p-4">
            {todayProducts.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {todayProducts.map(product => (
                  <div key={product.id} className="relative flex items-center justify-between overflow-hidden rounded-xl border border-[#2A2C33] bg-[#1A1B20] px-4 py-4">
                    <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#4F7FFF] to-[#A855F7]" aria-hidden="true" />
                    <Checkbox
                      checked={completedList.includes(product.id)}
                      onChange={() => toggleProductDone(product.id)}
                      label={product.name}
                      sublabel={product.category}
                    />
                    {product.notes && (
                      <span className="text-[10px] text-[var(--text-secondary)] ml-2 shrink-0">{product.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                headline={`No products for ${timeOfDay}`}
                subtext={`${currentSeason} routine is empty. Add products to build this checklist.`}
                ctaLabel="+ Add products"
                onAction={() => { setView('all'); setShowForm(true) }}
              />
            )}
          </Card>
        </>
      ) : (
        <>
          {/* All products + Add button */}
          <div className="flex justify-end mb-3">
            <Button size="sm" icon={Plus} onClick={() => { setShowForm(true); setEditingProduct(null); setForm({ name: '', category: 'Cleanser', season: 'All-Season', timeOfDay: 'Both', notes: '', active: true }) }}>
              Add Product
            </Button>
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <Card className="p-4 mb-4 animate-fade-in-up">
              <h3 className="text-sm font-semibold mb-3">{editingProduct !== null ? 'Edit Product' : 'New Product'}</h3>
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Product name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Category"
                    options={skincareCategories}
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  />
                  <Select
                    label="Season"
                    options={seasonOptions}
                    value={form.season}
                    onChange={e => setForm({ ...form, season: e.target.value })}
                  />
                </div>
                <Select
                  label="Time of Day"
                  options={['AM', 'PM', 'Both']}
                  value={form.timeOfDay}
                  onChange={e => setForm({ ...form, timeOfDay: e.target.value })}
                />
                <Input
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={saveProduct} className="flex-1">Save</Button>
                  <Button variant="ghost" onClick={() => { setShowForm(false); setEditingProduct(null) }}>Cancel</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Products list */}
          <div className="flex flex-col gap-2">
            {products.length > 0 ? products.map((product, i) => (
              <Card key={product.id || i} className="p-3 flex items-center justify-between group" hover>
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-secondary)]">{product.category}</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">{product.season} · {product.timeOfDay}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => editProduct(i)} className="w-7 h-7 rounded-lg">
                    <Edit2 size={12} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteProduct(i)} className="w-7 h-7 rounded-lg text-[var(--status-bad)]">
                    <Trash2 size={12} />
                  </Button>
                </div>
              </Card>
            )) : (
              <Card className="overflow-hidden p-0">
                <EmptyState
                  icon={Package}
                  headline="No products added yet"
                  subtext="Add your first product to start building seasonal routines."
                  ctaLabel="+ Add products"
                  onAction={() => { setShowForm(true); setEditingProduct(null) }}
                />
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}
