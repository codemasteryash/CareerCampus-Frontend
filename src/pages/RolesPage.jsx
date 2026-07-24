import { useState, useEffect } from 'react'
import { roleApi } from '../api/endpoints/role'
import { userApi } from '../api/endpoints/user'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

const EXPERIENCE_CONFIG = {
  ENTRY: { style: 'bg-green-500/10 border-green-500/20 text-green-400', label: 'Entry Level' },
  MID: { style: 'bg-blue-500/10 border-blue-500/20 text-blue-400', label: 'Mid Level' },
  SENIOR: { style: 'bg-purple-500/10 border-purple-500/20 text-purple-400', label: 'Senior Level' },
}

const IMPORTANCE_CONFIG = {
  MUST_HAVE: { style: 'bg-red-500/10 border-red-500/20 text-red-400', dot: 'bg-red-400' },
  NICE_TO_HAVE: { style: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', dot: 'bg-yellow-400' },
}

const CARD_ICONS = ['⚙️', '🎨', '📊', '☁️', '🔐', '🤖', '📱', '🗄️', '🌐', '🔧']

function RoleCard({ role, isTarget, onSetTarget, settingTarget }) {
  const [expanded, setExpanded] = useState(false)
  const exp = EXPERIENCE_CONFIG[role.experienceLevel] || EXPERIENCE_CONFIG.MID
  const mustHave = role.requiredSkills?.filter(s => s.importance === 'MUST_HAVE') || []
  const niceToHave = role.requiredSkills?.filter(s => s.importance === 'NICE_TO_HAVE') || []
  const iconIndex = role.id % CARD_ICONS.length

  return (
    <div className={`bg-[#0f1623] border rounded-2xl transition-all hover:-translate-y-0.5 ${
      isTarget
        ? 'border-blue-500/40 shadow-lg shadow-blue-500/10'
        : 'border-[#1e2d45] hover:border-blue-500/20'
    }`}>

      {/* Card header */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              isTarget ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-[#141d2e] border border-[#1e2d45]'
            }`}>
              {CARD_ICONS[iconIndex]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white">{role.title}</h3>
                {isTarget && (
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    ✓ Your Target
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${exp.style}`}>
                  {exp.label}
                </span>
                <span className="text-[10px] text-[#475569]">
                  {role.requiredSkills?.length || 0} required skills
                </span>
              </div>
            </div>
          </div>
          <div className="text-[#475569] text-sm shrink-0 mt-1">
            {expanded ? '↑' : '↓'}
          </div>
        </div>

        {/* Description */}
        {role.description && (
          <p className="text-xs text-[#64748b] mt-3 leading-relaxed line-clamp-2">
            {role.description}
          </p>
        )}

        {/* Skill preview pills */}
        {!expanded && mustHave.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {mustHave.slice(0, 4).map(s => (
              <span key={s.skillId} className="text-[10px] px-2 py-0.5 rounded-lg bg-[#141d2e] border border-[#2e3d55] text-[#64748b]">
                {s.skillName}
              </span>
            ))}
            {mustHave.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#141d2e] border border-[#2e3d55] text-[#475569]">
                +{mustHave.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 pt-0 space-y-4 border-t border-[#1e2d45]">
          <div className="pt-4 space-y-4">

            {/* Must-have skills */}
            {mustHave.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-[10px] font-bold text-red-400 tracking-wide uppercase">
                    Must Have ({mustHave.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mustHave.map(s => (
                    <span
                      key={s.skillId}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${IMPORTANCE_CONFIG.MUST_HAVE.style}`}
                    >
                      {s.skillName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nice-to-have skills */}
            {niceToHave.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-[10px] font-bold text-yellow-400 tracking-wide uppercase">
                    Nice to Have ({niceToHave.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {niceToHave.map(s => (
                    <span
                      key={s.skillId}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${IMPORTANCE_CONFIG.NICE_TO_HAVE.style}`}
                    >
                      {s.skillName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Set as target button */}
            <div className="pt-2">
              {isTarget ? (
                <div className="flex items-center gap-2 text-xs text-blue-400">
                  <span>✓</span>
                  <span>This is your current target role</span>
                </div>
              ) : (
                <button
                  onClick={() => onSetTarget(role.title)}
                  disabled={settingTarget === role.title}
                  className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  {settingTarget === role.title ? 'Setting...' : '🎯 Set as my target role'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RolesPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('All')
  const [settingTarget, setSettingTarget] = useState(null)
  const [alert, setAlert] = useState(null)

  const showAlert = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  useEffect(() => {
    roleApi.getAllRoles()
      .then(res => setRoles(res.data))
      .catch(() => setError('Failed to load roles. Make sure your backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSetTarget = async (title) => {
    setSettingTarget(title)
    try {
      const res = await userApi.updateProfile({ name: user.name, targetJobRole: title })
      updateUser({ targetJobRole: res.data.targetJobRole })
      showAlert('success', `Target role set to "${title}". Head to Analysis to see your updated score!`)
    } catch {
      showAlert('error', 'Failed to update target role.')
    } finally {
      setSettingTarget(null)
    }
  }

  const levels = ['All', 'ENTRY', 'MID', 'SENIOR']

  const filtered = roles.filter(role => {
    const matchSearch = role.title.toLowerCase().includes(search.toLowerCase()) ||
      role.description?.toLowerCase().includes(search.toLowerCase())
    const matchLevel = levelFilter === 'All' || role.experienceLevel === levelFilter
    return matchSearch && matchLevel
  })

  if (loading) return <Spinner />

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Browse Roles</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Explore job roles and set one as your career target.
          </p>
        </div>
        {user?.targetJobRole && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20">
            <span className="text-lg">🎯</span>
            <div>
              <p className="text-[10px] text-[#64748b]">Current Target</p>
              <p className="text-xs font-bold text-blue-400">{user.targetJobRole}</p>
            </div>
          </div>
        )}
      </div>

      {/* Alert */}
      {alert && (
        <div className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-between ${
          alert.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <span className="flex items-center gap-2">
            <span>{alert.type === 'success' ? '✓' : '✕'}</span>
            {alert.message}
          </span>
          {alert.type === 'success' && (
            <button
              onClick={() => navigate('/analysis')}
              className="text-xs text-green-300 underline hover:text-green-200 ml-4 whitespace-nowrap"
            >
              Run analysis →
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search roles..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0f1623] border border-[#1e2d45] text-white text-sm placeholder-[#374151] focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
        />
        <div className="flex items-center gap-1.5 p-1 bg-[#0f1623] border border-[#1e2d45] rounded-xl">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                levelFilter === level
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              {level === 'All' ? 'All Levels' :
               level === 'ENTRY' ? 'Entry' :
               level === 'MID' ? 'Mid' : 'Senior'}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#475569]">
          {filtered.length} role{filtered.length !== 1 ? 's' : ''} found
        </span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Must Have
          </span>
          <span className="flex items-center gap-1 text-yellow-400">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Nice to Have
          </span>
        </div>
      </div>

      {/* Role cards */}
      {filtered.length === 0 ? (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <span className="text-3xl">🔍</span>
          <p className="text-sm font-semibold text-white">No roles match your search</p>
          <p className="text-xs text-[#64748b]">Try a different search term or clear the filters.</p>
          <button
            onClick={() => { setSearch(''); setLevelFilter('All') }}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              isTarget={user?.targetJobRole === role.title}
              onSetTarget={handleSetTarget}
              settingTarget={settingTarget}
            />
          ))}
        </div>
      )}

      {/* Info card */}
      <div className="bg-blue-600/8 border border-blue-500/15 rounded-2xl p-5 flex gap-4">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <p className="text-sm font-semibold text-blue-300 mb-1">How target roles work</p>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Setting a target role drives everything in CareerCompass — your skill gap analysis,
            readiness score, AI roadmap generation, certification recommendations, and project
            suggestions all use your target role as the reference point. You can change your
            target role at any time and re-run your analysis to see updated results.
          </p>
        </div>
      </div>

    </div>
  )
}