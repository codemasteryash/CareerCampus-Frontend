import { useState } from 'react'
import { projectApi } from '../api/endpoints/projects'
import { useNavigate } from 'react-router-dom'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

const DIFFICULTY_CONFIG = {
  BEGINNER: { style: 'bg-green-500/10 border-green-500/20 text-green-400', bar: 'bg-green-500', width: 'w-1/3' },
  INTERMEDIATE: { style: 'bg-blue-500/10 border-blue-500/20 text-blue-400', bar: 'bg-blue-500', width: 'w-2/3' },
  ADVANCED: { style: 'bg-purple-500/10 border-purple-500/20 text-purple-400', bar: 'bg-purple-500', width: 'w-full' },
}

const CARD_ACCENTS = [
  'hover:border-blue-500/40',
  'hover:border-cyan-500/40',
  'hover:border-purple-500/40',
  'hover:border-pink-500/40',
  'hover:border-orange-500/40',
]

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  const diff = DIFFICULTY_CONFIG[project.difficulty] || DIFFICULTY_CONFIG.INTERMEDIATE
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]

  return (
    <div
      className={`bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-5 transition-all hover:-translate-y-0.5 ${accent} cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💡</span>
            <h3 className="text-sm font-bold text-white leading-snug">{project.title}</h3>
          </div>
          {project.relevantJobRole && (
            <span className="text-[10px] text-[#64748b]">For: {project.relevantJobRole}</span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${diff.style}`}>
            {project.difficulty[0] + project.difficulty.slice(1).toLowerCase()}
          </span>
          {project.estimatedHours && (
            <span className="text-[10px] text-[#475569]">⏱ {project.estimatedHours}h</span>
          )}
        </div>
      </div>

      {/* Difficulty bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1 bg-[#1e2d45] rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${diff.bar} ${diff.width} transition-all`} />
        </div>
        <span className="text-[10px] text-[#475569]">Difficulty</span>
      </div>

      {/* Reason */}
      {project.reason && (
        <div className="bg-[#141d2e] rounded-xl p-3 mb-3">
          <p className="text-[11px] text-[#94a3b8] leading-relaxed">
            <span className="text-cyan-400 font-semibold">Why this project: </span>
            {project.reason}
          </p>
        </div>
      )}

      {/* Skills covered */}
      {project.skillsCovered?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.skillsCovered.map(skill => (
            <span
              key={skill}
              className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-[#141d2e] border border-[#2e3d55] text-[#64748b]"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Expanded description */}
      {expanded && project.description && (
        <div className="mt-3 pt-3 border-t border-[#1e2d45]">
          <p className="text-xs text-[#94a3b8] leading-relaxed">{project.description}</p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-[#475569]">
          {expanded ? 'Click to collapse ↑' : 'Click to expand ↓'}
        </span>
        {project.estimatedHours && (
          <span className="text-[10px] text-[#475569]">
            ~{project.estimatedHours} hours to complete
          </span>
        )}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ran, setRan] = useState(false)

  const loadProjects = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await projectApi.getRecommendations()
      setProjects(res.data)
      setRan(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommendations. Make sure your target role is set.')
    } finally {
      setLoading(false)
    }
  }

  const diffCounts = {
    BEGINNER: projects.filter(p => p.difficulty === 'BEGINNER').length,
    INTERMEDIATE: projects.filter(p => p.difficulty === 'INTERMEDIATE').length,
    ADVANCED: projects.filter(p => p.difficulty === 'ADVANCED').length,
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Project Recommendations</h1>
          <p className="text-sm text-[#64748b] mt-1">
            AI-curated portfolio projects tailored to your skill gaps and target role.
          </p>
        </div>
        <button
          onClick={loadProjects}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/20"
        >
          {loading ? 'Generating...' : ran ? '↺ Regenerate' : '✨ Generate projects'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-sm flex items-start gap-2">
          <span className="shrink-0">✕</span>
          <div>
            <p>{error}</p>
            {error.includes('target role') && (
              <button
                onClick={() => navigate('/profile')}
                className="text-xs text-red-300 underline mt-1 hover:text-red-200"
              >
                Set target role in Profile →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-12 flex flex-col items-center gap-4">
          <Spinner />
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Generating project recommendations...</p>
            <p className="text-xs text-[#64748b] mt-1">AI is crafting projects based on your skill profile.</p>
          </div>
        </div>
      )}

      {/* Pre-run state */}
      {!ran && !loading && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-12 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/20 flex items-center justify-center text-4xl">
            💡
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-2">Build a portfolio that impresses</h2>
            <p className="text-sm text-[#64748b] max-w-md leading-relaxed">
              AI will suggest 5 hands-on projects specifically designed to close your skill gaps
              and showcase the abilities your target role requires.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            {[
              { icon: '🎯', label: 'Role-specific' },
              { icon: '🧠', label: 'Skill-targeted' },
              { icon: '📈', label: 'Portfolio-ready' },
            ].map(f => (
              <div key={f.label} className="bg-[#141d2e] rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{f.icon}</div>
                <p className="text-[10px] text-[#64748b] font-medium">{f.label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={loadProjects}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            Generate my projects →
          </button>
        </div>
      )}

      {/* Results */}
      {ran && !loading && projects.length > 0 && (
        <div className="space-y-5">
          {/* Stats bar */}
          <div className="flex items-center gap-4 p-4 bg-[#0f1623] border border-[#1e2d45] rounded-2xl">
            <span className="text-xs text-[#64748b] font-semibold">{projects.length} projects generated</span>
            <div className="flex-1 h-px bg-[#1e2d45]" />
            {Object.entries(diffCounts).map(([diff, count]) => count > 0 && (
              <span key={diff} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_CONFIG[diff]?.style}`}>
                {count} {diff[0] + diff.slice(1).toLowerCase()}
              </span>
            ))}
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>

          {/* Re-generate tip */}
          <div className="bg-blue-600/8 border border-blue-500/15 rounded-2xl p-4 flex gap-3">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Projects are generated fresh each time based on your current skill profile.
              Add more skills to your profile or update your target role, then regenerate to get different suggestions.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}