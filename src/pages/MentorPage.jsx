import { useState, useRef, useEffect } from 'react'
import { mentorApi } from '../api/endpoints/mentor'
import { useAuthStore } from '../store/authStore'

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white shrink-0">
        AI
      </div>
      <div className="bg-[#141d2e] border border-[#1e2d45] rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
        isUser
          ? 'bg-[#1e2d45] text-[#94a3b8]'
          : 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white'
      }`}>
        {isUser ? 'Y' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-[#141d2e] border border-[#1e2d45] text-[#94a3b8] rounded-bl-sm'
        }`}>
          {msg.content}
        </div>
        <span className="text-[10px] text-[#374151] px-1">{msg.time}</span>
      </div>
    </div>
  )
}

const SUGGESTED_PROMPTS = [
  'What skills should I learn next?',
  'How long will it take to be job ready?',
  'What projects should I build for my portfolio?',
  'Which certifications are most valuable for me?',
  'How can I improve my readiness score?',
  'What salary can I expect for my target role?',
]

export default function MentorPage() {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const getTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const sendMessage = async (text) => {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMsg = { role: 'user', content: messageText, time: getTime() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError('')

    // Build conversation history for context
    const history = messages.map(m =>
      `${m.role === 'user' ? 'User' : 'Mentor'}: ${m.content}`
    )

    try {
      const res = await mentorApi.chat({
        message: messageText,
        conversationHistory: history.length > 0 ? history : undefined,
      })
      const aiMsg = {
        role: 'ai',
        content: res.data.reply,
        time: getTime(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      setError('Failed to get a response. Please try again.')
      // Remove the user message if AI failed
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setError('')
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Career Mentor</h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Personalized career advice powered by AI — knows your skills and goals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-green-400">Online</span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-3 py-1.5 text-xs text-[#64748b] border border-[#1e2d45] rounded-lg hover:text-[#94a3b8] hover:border-[#2e4060] transition-all"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-[#0f1623] border border-[#1e2d45] rounded-2xl flex flex-col overflow-hidden">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-1">

          {/* Welcome state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl shadow-xl shadow-blue-500/20">
                🤖
              </div>
              <div className="text-center">
                <h2 className="text-base font-bold text-white mb-1">
                  Hey {user?.name?.split(' ')[0]}, I'm your AI Career Mentor
                </h2>
                <p className="text-sm text-[#64748b] max-w-sm leading-relaxed">
                  I know your target role and current skills. Ask me anything about
                  your career path, skill development, or job search strategy.
                </p>
              </div>

              {/* Suggested prompts */}
              <div className="w-full max-w-md space-y-2">
                <p className="text-[10px] font-semibold text-[#475569] tracking-widest uppercase text-center mb-3">
                  Suggested questions
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left text-xs text-[#64748b] hover:text-[#94a3b8] px-4 py-2.5 rounded-xl border border-[#1e2d45] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}

          {/* Typing indicator */}
          {loading && <TypingIndicator />}

          {/* Error */}
          {error && (
            <div className="flex justify-center my-2">
              <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                {error}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts strip — shown after first message */}
        {messages.length > 0 && (
          <div className="px-4 py-2 border-t border-[#1e2d45] flex gap-2 overflow-x-auto scrollbar-none">
            {SUGGESTED_PROMPTS.slice(0, 4).map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="text-[10px] text-[#64748b] hover:text-blue-400 border border-[#1e2d45] hover:border-blue-500/30 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="p-4 border-t border-[#1e2d45]">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI career mentor anything..."
                rows={1}
                disabled={loading}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white text-sm placeholder-[#374151] focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none disabled:opacity-50 leading-relaxed"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 shrink-0"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-[10px] text-[#374151] mt-2 text-center">
            Press Enter to send · Shift+Enter for new line · Context is kept within this session
          </p>
        </div>
      </div>
    </div>
  )
}