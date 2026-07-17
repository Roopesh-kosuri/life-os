/**
 * Groq API Service for LIFE OS
 * 
 * Uses direct fetch to Groq's OpenAI-compatible API.
 * No SDK needed — keeps bundle small.
 * 
 * FREE TIER LIMITS (as of 2024):
 * - llama-3.3-70b-versatile: 30 req/min, 14,400 req/day, 6,000 tokens/min
 * - More than enough for personal use (food verdicts, sleep comments, chat)
 * 
 * The user provides their own Groq API key via Settings.
 * Key is stored in Firestore, never hardcoded.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const PERSONA_SYSTEM_PROMPT = `You are the AI assistant inside LIFE OS, a personal command center app. Your personality:
- Sharp, funny, slightly savage workout-bro-meets-study-buddy
- Motivate honestly — no toxic positivity, light roasting is encouraged
- Keep responses SHORT (1-3 sentences max for verdicts, slightly longer for chat)
- Use gym/study culture references naturally
- Be supportive underneath the humor — you genuinely want the user to succeed
- Never use emojis excessively (1-2 max per message)
- No corporate language, no "I'd be happy to help" vibes`

async function callGroq(messages, apiKey) {
  if (!apiKey) {
    return { error: 'No API key set. Add your Groq API key in Settings.' }
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: PERSONA_SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.8,
        max_tokens: 200,
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 429) {
        return { error: 'Rate limited — chill for a minute and try again.' }
      }
      return { error: errorData.error?.message || `API error: ${response.status}` }
    }

    const data = await response.json()
    return { content: data.choices[0]?.message?.content || 'No response.' }
  } catch (err) {
    return { error: `Network error: ${err.message}` }
  }
}

/**
 * Get a funny one-liner verdict on a food log entry
 */
export async function getFoodVerdict(macros, targets, apiKey) {
  const { calories, protein } = macros
  const messages = [{
    role: 'user',
    content: `I just logged my food for today. Current totals: ${calories} calories (target: ${targets.calories}), ${protein}g protein (target: ${targets.protein}g). Give me a one-line funny verdict — are my macros looking good, mid, or tragic? Be a sarcastic gym bro about it.`
  }]
  return callGroq(messages, apiKey)
}

/**
 * Get a hydration nudge when behind on water
 */
export async function getWaterNudge(current, target, apiKey) {
  const pct = Math.round((current / target) * 100)
  const messages = [{
    role: 'user',
    content: `It's getting late and I've only had ${current}ml of water out of my ${target}ml target (${pct}%). Give me a one-liner to shame me into drinking more water. Be funny but genuinely motivating.`
  }]
  return callGroq(messages, apiKey)
}

/**
 * Get a funny sleep comment
 */
export async function getSleepComment(hours, apiKey) {
  const messages = [{
    role: 'user',
    content: `I slept ${hours} hours last night. Give me a one-line funny verdict on my sleep quality. Reference that 7-9 hours is ideal for gains.`
  }]
  return callGroq(messages, apiKey)
}

/**
 * Get a productivity daily summary verdict
 */
export async function getDailySummary(timeBlocks, goal, apiKey) {
  const breakdown = Object.entries(timeBlocks)
    .map(([cat, hrs]) => `${cat}: ${hrs}h`)
    .join(', ')
  
  const messages = [{
    role: 'user',
    content: `Here's how I spent my day: ${breakdown}. My daily productive-work goal is ${goal} hours. Give me a 2-line funny verdict — was this a W or an L day? Roast if Gaming >> Study, hype if productive work was solid.`
  }]
  return callGroq(messages, apiKey)
}

/**
 * General chat response
 */
export async function getChatResponse(history, apiKey) {
  return callGroq(history, apiKey)
}

export { PERSONA_SYSTEM_PROMPT }
