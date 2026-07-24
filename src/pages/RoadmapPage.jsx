import { useState, useEffect } from 'react'
import { roadmapApi } from '../api/endpoints/roadmap'
import { useNavigate } from 'react-router-dom'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

const STATUS_STYLES = {
  NOT_STARTED: {
    dot: 'bg-[#374151] border-[#4b5563]',
    badge: 'bg-[#1e2d45] text-[#64748b] border-[#2e3d55]',
    label: 'Not Started',
    card: 'border-[#1e2d45] bg-[#0a0f1a]',
    text: 'text-[#64748b]',
  },
  IN_PROGRESS: {
    dot: 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    label: 'In Progress',
    card: 'border-blue-500/30 bg-[#0d1520]',
    text: 'text-white',
  },
  COMPLETED: {
    dot: 'bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]',
    badge: 'bg-green-500/15 text-green-400 border-green-500/25',
    label: 'Completed',
    card: 'border-green-500/20 bg-[#0a1210]',
    text: 'text-[#94a3b8]',
  },
}

const DOT_COLORS = ['bg-orange-400', 'bg-yellow-400', 'bg-blue-400', 'bg-purple-400', 'bg-cyan-400', 'bg-pink-400', 'bg-green-400', 'bg-red-400', 'bg-indigo-400', 'bg-teal-400']

export default function RoadmapPage() {
  const navigate = useNavigate()
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [updating, setUpdating] = useState(null)
  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState(null)

  useEffect(() => {
    fetchRoadmap()
  }, [])

  const fetchRoadmap = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await roadmapApi.getMyRoadmap()
      setRoadmap(res.data)
    } catch (err) {
      const msg = err.response?.data?.message || ''
      if (msg.includes('target job role') || msg.includes('Please set')) {
        setError('no-role')
      } else {
        setError('failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const generateRoadmap = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await roadmapApi.getMyRoadmap()
      setRoadmap(res.data)
    } catch {
      setError('failed')
    } finally {
      setGenerating(false)
    }
  }

  const updateStep = async (stepId, status) => {
    setUpdating(stepId)
    try {
      await roadmapApi.updateProgress({ stepId, status })
      setRoadmap(prev => ({
        ...prev,
        steps: prev.steps.map(s => s.id === stepId ? { ...s, status } : s),
        completedSteps: prev.steps.filter(s =>
          s.id === stepId ? status === 'COMPLETED' : s.status === 'COMPLETED'
        ).length,
      }))
    } catch {
      // silent fail — UI stays consistent
    } finally {
      setUpdating(null)
    }
  }

  const cycleStatus = (step) => {
    const next = {
      NOT_STARTED: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'NOT_STARTED',
    }
    updateStep(step.id, next[step.status])
  }

  const pct = roadmap?.totalSteps > 0
    ? Math.round((roadmap.completedSteps / roadmap.totalSteps) * 100)
    : 0

  if (loading) return <Spinner />

  if (generating) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-10 h-10 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-sm font-semibold text-white">Generating your roadmap...</p>
        <p className="text-xs text-[#64748b] mt-1">AI is building your personalized learning path. This takes ~10 seconds.</p>
      </div>
    </div>
  )

  if (error === 'no-role') return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <span className="text-4xl">🎯</span>
      <div>
        <p className="text-base font-bold text-white">No target role set</p>
        <p className="text-sm text-[#64748b] mt-1 max-w-xs">Set your target job role in your profile first, then come back to generate your roadmap.</p>
      </div>
      <button
        onClick={() => navigate('/profile')}
        className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
      >
        Go to Profile →
      </button>
    </div>
  )

  if (error === 'failed') return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <span className="text-4xl">⚠️</span>
      <p className="text-sm text-[#64748b]">Failed to load roadmap.</p>
      <button onClick={fetchRoadmap} className="text-xs text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors">
        Retry
      </button>
    </div>
  )

  if (!roadmap) return (
    <div className="flex flex-col items-center justify-center h-64 gap-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/20 flex items-center justify-center text-4xl">🗺️</div>
      <div>
        <p className="text-base font-bold text-white">No roadmap yet</p>
        <p className="text-sm text-[#64748b] mt-1 max-w-sm">AI will generate a personalized 8-10 step learning path for your target role.</p>
      </div>
      <button onClick={generateRoadmap} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/25">
        Generate my roadmap →
      </button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Roadmap</h1>
          <p className="text-sm text-[#64748b] mt-1">{roadmap.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-[#64748b]">Progress</p>
            <p className="text-sm font-bold text-white">{roadmap.completedSteps}/{roadmap.totalSteps} steps · {pct}%</p>
          </div>
          <button
            onClick={generateRoadmap}
            className="px-3 py-2 text-xs font-semibold text-[#64748b] border border-[#1e2d45] rounded-xl hover:border-[#2e4060] hover:text-[#94a3b8] transition-all"
          >
            Regenerate
          </button>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">Overall Progress</span>
          <span className="text-xs font-bold text-white">{pct}% complete</span>
        </div>
        <div className="h-2.5 bg-[#1e2d45] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-[#475569]">
          <span>{roadmap.completedSteps} completed</span>
          <span>{roadmap.totalSteps - roadmap.completedSteps} remaining</span>
        </div>
      </div>

      {/* Description */}
      {roadmap.description && (
        <div className="bg-blue-600/8 border border-blue-500/15 rounded-2xl p-4">
          <p className="text-sm text-[#94a3b8] leading-relaxed">{roadmap.description}</p>
        </div>
      )}

      {/* Two-column layout: Steps list left, Timeline right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — Phase Cards (reference image left panel) */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-[#64748b] tracking-widest uppercase px-1">Steps</p>
          {roadmap.steps?.map((step, i) => {
            const style = STATUS_STYLES[step.status] || STATUS_STYLES.NOT_STARTED
            const isActive = activeStep === step.id
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(isActive ? null : step.id)}
                className={`border rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 ${style.card} ${isActive ? 'ring-1 ring-blue-500/30' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Step number */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                      step.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                      step.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-[#1e2d45] text-[#475569]'
                    }`}>
                      {step.status === 'COMPLETED' ? '✓' : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${style.text}`}>{step.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}>
                          {style.label}
                        </span>
                        {step.estimatedDays && (
                          <span className="text-[10px] text-[#475569]">{step.estimatedDays}d</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cycle button */}
                  <button
                    onClick={e => { e.stopPropagation(); cycleStatus(step) }}
                    disabled={updating === step.id}
                    className="w-7 h-7 rounded-lg border border-[#2e4060] text-[#64748b] hover:text-white hover:border-blue-500/40 hover:bg-blue-500/10 transition-all flex items-center justify-center text-sm shrink-0 disabled:opacity-40"
                    title="Click to change status"
                  >
                    {updating === step.id ? (
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : '+'}
                  </button>
                </div>

                {/* Expanded detail */}
                {isActive && (
                  <div className="mt-4 pt-4 border-t border-[#1e2d45] space-y-3">
                    {step.description && (
                      <p className="text-xs text-[#94a3b8] leading-relaxed">{step.description}</p>
                    )}
                    {step.resourceUrl && (
                      <a
                        href={step.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        📖 Learning Resource →
                      </a>
                    )}
                    {/* Status actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].map(s => (
                        <button
                          key={s}
                          onClick={e => { e.stopPropagation(); updateStep(step.id, s) }}
                          disabled={updating === step.id || step.status === s}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all disabled:opacity-40 ${
                            step.status === s
                              ? STATUS_STYLES[s].badge
                              : 'border-[#1e2d45] text-[#475569] hover:border-[#2e4060] hover:text-[#64748b]'
                          }`}
                        >
                          {s === 'NOT_STARTED' ? 'Not Started' : s === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right — Timeline (reference image right panel) */}
        <div className="relative pl-8">
          <p className="text-xs font-semibold text-[#64748b] tracking-widest uppercase mb-5">Timeline</p>

          {/* Vertical line */}
          <div className="absolute left-[15px] top-10 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-[#1e2d45] to-transparent" />

          <div className="space-y-8">
            {roadmap.steps?.map((step, i) => {
              const dotColor = DOT_COLORS[i % DOT_COLORS.length]
              const style = STATUS_STYLES[step.status] || STATUS_STYLES.NOT_STARTED
              return (
                <div key={step.id} className="relative">
                  {/* Dot on the line */}
                  <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 ${
                    step.status === 'COMPLETED' ? 'bg-green-500 border-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                    step.status === 'IN_PROGRESS' ? 'bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                    `${dotColor} border-white/20 opacity-60`
                  }`} />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-white">{i + 1}. {step.title}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>

                    {step.description && (
                      <div className="space-y-1.5">
                        {step.description.split('.').filter(s => s.trim()).slice(0, 2).map((sentence, si) => (
                          <div key={si} className="flex items-start gap-2">
                            <span className="text-[#374151] mt-0.5 shrink-0">•</span>
                            <p className="text-xs text-[#64748b] leading-relaxed">{sentence.trim()}.</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      {step.estimatedDays && (
                        <span className="text-[10px] text-[#475569]">⏱ {step.estimatedDays} days</span>
                      )}
                      {step.resourceUrl && (
                        <a
                          href={step.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Resource →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-4 flex items-center gap-6">
        <span className="text-xs text-[#475569] font-semibold">Click + to cycle status:</span>
        {Object.entries(STATUS_STYLES).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${s.dot}`} />
            <span className={`text-[10px] font-medium ${s.text}`}>{s.label}</span>
          </div>
        ))}
      </div>

    </div>
  )
}