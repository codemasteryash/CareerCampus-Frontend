import { useState, useEffect } from 'react'
import { skillApi } from '../api/endpoints/skill'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-7 h-7 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

const PROFICIENCY_COLORS = {
  BEGINNER: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  INTERMEDIATE: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  ADVANCED: 'bg-green-500/10 border-green-500/20 text-green-400',
}

const SOURCE_COLORS = {
  RESUME_PARSED: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  SELF_DECLARED: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
}

function Badge({ text, style }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style}`}>
      {text}
    </span>
  )
}

export default function SkillsPage() {
  const [allSkills, setAllSkills] = useState([])
  const [mySkills, setMySkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState(null)
  const [alert, setAlert] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [proficiency, setProficiency] = useState('INTERMEDIATE')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const showAlert = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3500)
  }

  useEffect(() => {
    Promise.all([skillApi.getAllSkills(), skillApi.getMySkills()])
      .then(([allRes, myRes]) => {
        setAllSkills(allRes.data)
        setMySkills(myRes.data)
      })
      .catch(() => showAlert('error', 'Failed to load skills.'))
      .finally(() => setLoading(false))
  }, [])

  const mySkillIds = new Set(mySkills.map(s => s.skillId))
  const categories = ['All', ...new Set(allSkills.map(s => s.category).filter(Boolean))]
  const filteredSkills = allSkills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'All' || s.category === categoryFilter
    return matchSearch && matchCategory
  })

  const handleAdd = async () => {
    if (!selectedSkill) return
    setAdding(true)
    try {
      const res = await skillApi.addSkill({ skillId: Number(selectedSkill), proficiencyLevel: proficiency })
      setMySkills(prev => [...prev, res.data])
      setSelectedSkill('')
      showAlert('success', 'Skill added to your profile.')
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to add skill.')
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (skillId) => {
    setRemoving(skillId)
    try {
      await skillApi.removeSkill(skillId)
      setMySkills(prev => prev.filter(s => s.skillId !== skillId))
      showAlert('success', 'Skill removed.')
    } catch {
      showAlert('error', 'Failed to remove skill.')
    } finally {
      setRemoving(null)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Skills</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {mySkills.length} in your profile · {allSkills.length} in catalogue
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#475569] mr-1">Add as:</span>
          {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(p => (
            <button key={p} onClick={() => setProficiency(p)}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition-all ${
                proficiency === p ? PROFICIENCY_COLORS[p] : 'border-[#1e2d45] text-[#475569] hover:text-[#64748b]'
              }`}>
              {p[0] + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {alert && (
        <div className={`px-4 py-3 rounded-xl border text-sm flex items-center gap-2 ${
          alert.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <span>{alert.type === 'success' ? '✓' : '✕'}</span>{alert.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Catalogue — fixed height with internal scroll */}
        <div className="lg:col-span-3 bg-[#0f1623] border border-[#1e2d45] rounded-2xl flex flex-col" style={{height:'620px'}}>
          <div className="p-4 border-b border-[#1e2d45] space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">Skill Catalogue</span>
              <span className="text-[10px] text-[#475569]">{filteredSkills.length}/{allSkills.length}</span>
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search all skills..."
              className="w-full px-3 py-2 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white text-sm placeholder-[#374151] focus:outline-none focus:border-blue-500/60 transition-all" />
            <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{scrollbarWidth:'none'}}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all whitespace-nowrap shrink-0 ${
                    categoryFilter === cat ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-[#1e2d45] text-[#475569] hover:text-[#64748b]'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ALL skills scrollable */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {filteredSkills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-[#475569]">No skills match your search.</p>
                <button onClick={() => { setSearch(''); setCategoryFilter('All') }}
                  className="text-xs text-blue-400 mt-2 hover:text-blue-300">Clear filters</button>
              </div>
            ) : filteredSkills.map(skill => {
              const alreadyAdded = mySkillIds.has(skill.id)
              const isSelected = selectedSkill === String(skill.id)
              return (
                <div key={skill.id} onClick={() => !alreadyAdded && setSelectedSkill(isSelected ? '' : String(skill.id))}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                    alreadyAdded ? 'bg-blue-500/5 border-blue-500/15 cursor-default'
                    : isSelected ? 'bg-blue-600/15 border-blue-500/40 cursor-pointer'
                    : 'bg-[#141d2e] border-[#1e2d45] hover:border-blue-500/20 cursor-pointer'
                  }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${alreadyAdded ? 'bg-blue-400' : isSelected ? 'bg-blue-500' : 'bg-[#374151]'}`} />
                    <span className="text-sm text-white font-medium">{skill.name}</span>
                    {skill.category && <span className="text-[10px] text-[#475569]">{skill.category}</span>}
                  </div>
                  {alreadyAdded ? (
                    <span className="text-[10px] text-blue-400 font-semibold shrink-0">✓ Added</span>
                  ) : isSelected ? (
                    <span className="text-[10px] text-blue-400 font-semibold shrink-0">Selected ✓</span>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="p-4 border-t border-[#1e2d45] shrink-0">
            <button onClick={handleAdd} disabled={!selectedSkill || adding}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20">
              {adding ? 'Adding...' : selectedSkill ? `Add as ${proficiency.toLowerCase()} →` : 'Click a skill to select it'}
            </button>
          </div>
        </div>

        {/* My Skills — fixed height with internal scroll */}
        <div className="lg:col-span-2 bg-[#0f1623] border border-[#1e2d45] rounded-2xl flex flex-col" style={{height:'620px'}}>
          <div className="p-4 border-b border-[#1e2d45] shrink-0 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">Your Profile</span>
            <span className="text-[10px] text-[#475569]">{mySkills.length} skills</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {mySkills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <span className="text-4xl">🧠</span>
                <p className="text-sm text-[#64748b]">No skills yet.</p>
                <p className="text-xs text-[#475569] max-w-[180px]">Select from the catalogue or upload your resume.</p>
              </div>
            ) : mySkills.map(skill => (
              <div key={skill.skillId}
                className="flex items-center justify-between px-3 py-3 rounded-xl bg-[#141d2e] border border-[#1e2d45] hover:border-[#2e4060] transition-all group">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{skill.skillName}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge text={skill.proficiencyLevel[0] + skill.proficiencyLevel.slice(1).toLowerCase()} style={PROFICIENCY_COLORS[skill.proficiencyLevel]} />
                    <Badge text={skill.source === 'RESUME_PARSED' ? 'Resume' : 'Manual'} style={SOURCE_COLORS[skill.source]} />
                  </div>
                </div>
                <button onClick={() => handleRemove(skill.skillId)} disabled={removing === skill.skillId}
                  className="text-[#374151] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xl leading-none ml-2 disabled:opacity-50 shrink-0">
                  {removing === skill.skillId ? '·' : '×'}
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[#1e2d45] space-y-1.5 shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PROFICIENCY_COLORS).map(([key, style]) => (
                <Badge key={key} text={key[0] + key.slice(1).toLowerCase()} style={style} />
              ))}
            </div>
            <div className="flex gap-1.5">
              <Badge text="Resume" style={SOURCE_COLORS.RESUME_PARSED} />
              <Badge text="Manual" style={SOURCE_COLORS.SELF_DECLARED} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}