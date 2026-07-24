import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardApi } from '../api/endpoints/dashboard'
import { useAuthStore } from '../store/authStore'

// ── Spinner ────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent = false, icon }) {
  return (
    <div className={`p-5 rounded-2xl border transition-all hover:border-blue-500/30 hover:-translate-y-0.5
      ${accent
        ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border-blue-500/30'
        : 'bg-[#0f1623] border-[#1e2d45]'
      }`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{icon}</span>
        {accent && (
          <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
            Primary
          </span>
        )}
      </div>
      <div className={`text-2xl font-black tracking-tight ${accent ? 'text-blue-300' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-[#64748b] font-medium mt-1">{label}</div>
      {sub && <div className="text-[11px] text-[#475569] mt-0.5">{sub}</div>}
    </div>
  )
}

// ── Progress Ring ──────────────────────────────────────────────────────────
function ProgressRing({ score, level }) {
  const radius = 54
  const circ = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#06b6d4' : score >= 60 ? '#3b82f6' : score >= 40 ? '#8b5cf6' : '#f59e0b'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#1e2d45" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">{score}</span>
          <span className="text-[10px] text-[#64748b] font-medium">/100</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold" style={{ color }}>{level}</span>
    </div>
  )
}

// ── Missing Skill Badge ────────────────────────────────────────────────────
function SkillBadge({ skill, index }) {
  const colors = [
    'bg-red-500/10 border-red-500/20 text-red-400',
    'bg-orange-500/10 border-orange-500/20 text-orange-400',
    'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    'bg-purple-500/10 border-purple-500/20 text-purple-400',
    'bg-pink-500/10 border-pink-500/20 text-pink-400',
  ]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${colors[index % colors.length]}`}>
      <span className="w-1 h-1 rounded-full bg-current opacity-70" />
      {skill}
    </span>
  )
}

// ── Next Step Item ─────────────────────────────────────────────────────────
function NextStepItem({ step, index }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#1e2d45] last:border-0">
      <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0 mt-0.5">
        {index + 1}
      </div>
      <span className="text-sm text-[#94a3b8] leading-relaxed">{step}</span>
    </div>
  )
}

// ── Roadmap Progress Bar ───────────────────────────────────────────────────
function RoadmapBar({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#64748b] font-medium">Roadmap Progress</span>
        <span className="text-xs font-bold text-white">{completed}/{total} steps</span>
      </div>
      <div className="h-2 bg-[#1e2d45] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#475569]">0%</span>
        <span className="text-[10px] text-blue-400 font-semibold">{pct}% complete</span>
        <span className="text-[10px] text-[#475569]">100%</span>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardApi.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard. Make sure your backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) return <Spinner />

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <span className="text-3xl">⚠️</span>
      <p className="text-[#64748b] text-sm">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  )

  const score = data?.readinessScore ?? 0
  const level = data?.readinessLevel ?? 'Not calculated'
  const missing = data?.topMissingSkills ?? []
  const nextSteps = data?.suggestedNextSteps ?? []
  const certCount = data?.certificationCount ?? 0
  const totalSkills = data?.totalSkills ?? 0
  const completedSteps = data?.completedRoadmapSteps ?? 0
  const totalSteps = data?.totalRoadmapSteps ?? 0
  const targetRole = data?.targetJobRole ?? user?.targetJobRole ?? 'Not set'

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Here's your career snapshot for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#0f1623] border border-[#1e2d45] text-xs text-[#64748b]">
            🎯 <span className="text-[#94a3b8] font-medium ml-1">{targetRole}</span>
          </div>
          <button
            onClick={() => navigate('/analysis')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-600/20"
          >
            Run analysis →
          </button>
        </div>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🧠" label="Skills in profile" value={totalSkills} accent />
        <StatCard icon="🏅" label="Certifications done" value={certCount} />
        <StatCard icon="🗺️" label="Roadmap steps done" value={`${completedSteps}/${totalSteps}`} sub={totalSteps > 0 ? `${Math.round((completedSteps/totalSteps)*100)}% complete` : 'No roadmap yet'} />
        <StatCard icon="🔍" label="Skill gaps found" value={missing.length} sub="Must-have skills missing" />
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Readiness Score Card */}
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500/20 transition-all">
          <div className="text-xs font-semibold text-[#64748b] tracking-widest uppercase self-start">
            Readiness Score
          </div>
          <ProgressRing score={score} level={level} />
          <p className="text-xs text-[#64748b] text-center leading-relaxed">
            {score >= 80
              ? 'You are job ready. Start applying now.'
              : score >= 60
              ? 'Almost there — close a few more skill gaps.'
              : score >= 40
              ? 'Good progress — keep learning.'
              : 'Early stage — focus on must-have skills first.'}
          </p>
          <button
            onClick={() => navigate('/analysis')}
            className="w-full py-2 text-xs font-semibold text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/10 transition-all"
          >
            View full analysis →
          </button>
        </div>

        {/* Missing Skills Card */}
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-6 hover:border-blue-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">
              Top Missing Skills
            </span>
            <button
              onClick={() => navigate('/skills')}
              className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
            >
              Add skills →
            </button>
          </div>
          {missing.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 gap-2">
              <span className="text-2xl">✅</span>
              <p className="text-xs text-[#64748b] text-center">
                No must-have skill gaps detected!
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missing.map((skill, i) => (
                <SkillBadge key={skill} skill={skill} index={i} />
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-[#1e2d45]">
            <RoadmapBar completed={completedSteps} total={totalSteps} />
          </div>
        </div>

        {/* Suggested Next Steps Card */}
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-6 hover:border-blue-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">
              AI Suggested Next Steps
            </span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              AI
            </span>
          </div>
          {nextSteps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 gap-2">
              <span className="text-2xl">🤖</span>
              <p className="text-xs text-[#64748b] text-center">
                Run your analysis to get AI-powered next steps.
              </p>
            </div>
          ) : (
            <div>
              {nextSteps.map((step, i) => (
                <NextStepItem key={i} step={step} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions Row ── */}
      <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-6">
        <div className="text-xs font-semibold text-[#64748b] tracking-widest uppercase mb-4">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Upload Resume', icon: '📄', path: '/resume', color: 'hover:border-blue-500/40 hover:text-blue-400' },
            { label: 'Skill Analysis', icon: '🔍', path: '/analysis', color: 'hover:border-cyan-500/40 hover:text-cyan-400' },
            { label: 'My Roadmap', icon: '🗺️', path: '/roadmap', color: 'hover:border-purple-500/40 hover:text-purple-400' },
            { label: 'Certifications', icon: '🏅', path: '/certifications', color: 'hover:border-yellow-500/40 hover:text-yellow-400' },
            { label: 'Projects', icon: '💡', path: '/projects', color: 'hover:border-green-500/40 hover:text-green-400' },
            { label: 'AI Mentor', icon: '🤖', path: '/mentor', color: 'hover:border-pink-500/40 hover:text-pink-400' },
          ].map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-[#1e2d45] bg-[#0a0f1a] text-[#64748b] text-xs font-medium transition-all hover:bg-[#141d2e] ${action.color}`}
            >
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}