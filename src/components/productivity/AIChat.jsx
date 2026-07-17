import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Trash2, AlertCircle } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useSyncedDoc } from '../../hooks/useFirestore'
import { useApp } from '../../context/AppContext'
import { getChatResponse } from '../../services/groq'

export default function AIChat() {
  const { groqApiKey, addToast } = useApp()
  const { data: chatData, setData: setChatData } = useSyncedDoc(
    ['productivity', 'chatHistory'],
    { messages: [] }
  )

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const messages = chatData.messages || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const sendMessage = async () => {
    if (!input.trim()) return
    if (!groqApiKey) {
      addToast('Add your Groq API key in Settings to use AI Chat.', 'warning')
      return
    }

    const userMsg = { role: 'user', content: input.trim(), timestamp: Date.now() }
    const newMessages = [...messages, userMsg]
    
    // Cap at 50 messages to stay within free tier
    // FREE TIER NOTE: Keeping history short reduces token usage per request
    const cappedMessages = newMessages.slice(-50)
    
    await setChatData({ messages: cappedMessages })
    setInput('')
    setLoading(true)

    // Build API messages (only role + content for Groq)
    const apiMessages = cappedMessages.map(m => ({ role: m.role, content: m.content }))
    
    const result = await getChatResponse(apiMessages, groqApiKey)
    setLoading(false)

    if (result.content) {
      const aiMsg = { role: 'assistant', content: result.content, timestamp: Date.now() }
      await setChatData({ messages: [...cappedMessages, aiMsg] })
    } else if (result.error) {
      addToast(result.error, 'error')
    }
  }

  const clearChat = async () => {
    await setChatData({ messages: [] })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up" style={{ height: 'calc(100dvh - 220px)', minHeight: '400px' }}>
      {/* Chat header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--accent-primary)]" />
          <span className="text-xs text-[var(--text-secondary)] font-semibold">
            Powered by Groq · llama-3.3-70b
          </span>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat} icon={Trash2}>
            Clear
          </Button>
        )}
      </div>

      {/* Messages area */}
      <Card className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center">
              <Sparkles size={20} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Your AI Study Buddy</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-xs">
                Ask me doubts, request motivation, or just chat. I'm funny, blunt, and here to help you lock in.
              </p>
            </div>
            {!groqApiKey && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)]">
                <AlertCircle size={14} className="text-[var(--status-bad)]" />
                <span className="text-xs text-[var(--status-bad)]">Add your Groq API key in Settings</span>
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent-primary)] text-[var(--text-primary)] rounded-br-md'
                    : 'bg-[var(--bg-input)] text-[var(--text-primary)] rounded-bl-md border border-[var(--border-main)]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--bg-input)] border border-[var(--border-main)] px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </Card>

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a doubt, request motivation..."
          className="input-field flex-1"
          disabled={loading}
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          icon={Send}
          size="icon"
          className="w-11 h-11 rounded-xl shrink-0 cursor-pointer"
        />
      </div>
    </div>
  )
}
