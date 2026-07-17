import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input, { Select } from '../ui/Input'
import Checkbox from '../ui/Checkbox'
import { useSyncedDoc } from '../../hooks/useFirestore'

const todoCategories = ['Study', 'DeepDive', 'Gym', 'Hardware', 'General']
const priorities = ['High', 'Medium', 'Low']
const priorityColors = { High: 'var(--status-bad)', Medium: 'var(--status-okay)', Low: 'var(--status-good)' }

export default function TodoList() {
  const { data: todoData, setData: setTodoData } = useSyncedDoc(
    ['productivity', 'todos'],
    { items: [] }
  )

  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({
    title: '', category: 'General', priority: 'Medium', dueDate: '', done: false
  })

  const todos = todoData.items || []

  const addTodo = async () => {
    if (!form.title.trim()) return
    const newTodo = { ...form, id: Date.now(), createdAt: new Date().toISOString() }
    await setTodoData({ items: [...todos, newTodo] })
    setForm({ title: '', category: 'General', priority: 'Medium', dueDate: '', done: false })
    setShowForm(false)
  }

  const toggleTodo = async (id) => {
    const newItems = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    await setTodoData({ items: newItems })
  }

  const deleteTodo = async (id) => {
    const newItems = todos.filter(t => t.id !== id)
    await setTodoData({ items: newItems })
  }

  // Filter and sort
  const filtered = todos
    .filter(t => filter === 'All' || t.category === filter)
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      const p = { High: 0, Medium: 1, Low: 2 }
      return (p[a.priority] || 1) - (p[b.priority] || 1)
    })

  const doneCount = todos.filter(t => t.done).length

  const getTodoColor = (category) => {
    switch (category) {
      case 'Gym': return 'gradient'
      case 'Study': return '#4ADE80' // emerald
      case 'DeepDive': return '#FF8A4C' // orange
      case 'Hardware': return '#06B6D4' // cyan
      default: return '#7C8CFF' // soft indigo
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Header stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-secondary)] font-semibold font-display">
            {doneCount}/{todos.length} done
          </span>
          {todos.length > 0 && (
            <div className="w-20 h-1.5 rounded-full bg-[var(--bg-input)] border border-[var(--border-main)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4F7FFF] to-[#A855F7] transition-all duration-500"
                style={{ width: `${todos.length > 0 ? (doneCount / todos.length) * 100 : 0}%` }}
              />
            </div>
          )}
        </div>
        <Button size="sm" icon={Plus} onClick={() => setShowForm(!showForm)}>
          Add
        </Button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...todoCategories].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`
              px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer select-none
              ${filter === cat
                ? 'bg-gradient-to-r from-[rgba(79,127,255,0.15)] to-[rgba(168,85,247,0.15)] text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="p-4 animate-fade-in-up">
          <div className="flex flex-col gap-3">
            <Input
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select
                label="Category"
                options={todoCategories}
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              />
              <Select
                label="Priority"
                options={priorities}
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              />
              <Input
                label="Due Date"
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addTodo} className="flex-1">Add Todo</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Todo list */}
      <div className="flex flex-col gap-2">
        {filtered.map(todo => (
          <Card key={todo.id} className="p-3 flex items-center justify-between group" hover>
            <div className="flex-1 min-w-0">
              <Checkbox
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                label={todo.title}
                activeColor={getTodoColor(todo.category)}
                sublabel={
                  <span className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] border border-[var(--border-main)] bg-[var(--bg-input)] font-semibold" style={{
                      color: priorityColors[todo.priority]
                    }}>
                      {todo.priority}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-medium">{todo.category}</span>
                    {todo.dueDate && <span className="text-[10px] text-[var(--text-secondary)]">· {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  </span>
                }
              />
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-[var(--text-secondary)] hover:text-[var(--status-bad)] transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2 cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-[var(--text-secondary)]">
            {todos.length === 0 ? 'No todos yet. Add one above.' : 'No todos in this category.'}
          </div>
        )}
      </div>
    </div>
  )
}

