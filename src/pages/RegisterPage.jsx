// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { authApi } from '../api/endpoints/auth'
// import { useAuthStore } from '../store/authStore'

// function RegisterPage() {
//   const navigate = useNavigate()
//   const { login } = useAuthStore()

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     targetJobRole: '',
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//     setError('')
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (form.password.length < 8) {
//       setError('Password must be at least 8 characters.')
//       return
//     }
//     setLoading(true)
//     try {
//       const res = await authApi.register(form)
//       login(res.data.token, {
//         name: res.data.name,
//         email: res.data.email,
//         targetJobRole: res.data.targetJobRole,
//       })
//       navigate('/dashboard')
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#080c14] flex items-center justify-center relative overflow-hidden py-8">

//       {/* Background glows */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
//         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[100px]" />
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px),
//                               linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
//             backgroundSize: '60px 60px'
//           }}
//         />
//       </div>

//       <div className="relative z-10 w-full max-w-md mx-4">
//         <div className="bg-[#0f1623]/90 backdrop-blur-xl border border-[#1e2d45] rounded-2xl p-8 shadow-2xl shadow-black/60">

//           {/* Logo */}
//           <div className="flex flex-col items-center mb-8">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-black text-white mb-4 shadow-lg shadow-blue-500/30">
//               CC
//             </div>
//             <h1 className="text-xl font-bold text-white">Start your journey</h1>
//             <p className="text-sm text-[#64748b] mt-1">Free. No credit card required.</p>
//           </div>

//           {error && (
//             <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">

//             {/* Name */}
//             <div>
//               <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
//                 Full Name
//               </label>
//               <input
//                 name="name"
//                 type="text"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Yash Gupta"
//                 required
//                 className="w-full px-4 py-3 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white placeholder-[#374151] text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
//                 Email
//               </label>
//               <input
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="you@example.com"
//                 required
//                 className="w-full px-4 py-3 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white placeholder-[#374151] text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
//               />
//             </div>

//             {/* Target Role */}
//             <div>
//               <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
//                 Target Job Role
//                 <span className="text-[#475569] normal-case font-normal ml-1">(optional)</span>
//               </label>
//               <input
//                 name="targetJobRole"
//                 type="text"
//                 value={form.targetJobRole}
//                 onChange={handleChange}
//                 placeholder="e.g. Backend Developer"
//                 className="w-full px-4 py-3 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white placeholder-[#374151] text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Min. 8 characters"
//                   required
//                   className="w-full px-4 py-3 pr-11 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white placeholder-[#374151] text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors"
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {/* Password strength indicator */}
//               {form.password.length > 0 && (
//                 <div className="mt-2 flex gap-1">
//                   {[1, 2, 3, 4].map((i) => (
//                     <div
//                       key={i}
//                       className={`h-0.5 flex-1 rounded-full transition-colors ${
//                         form.password.length >= i * 2
//                           ? form.password.length >= 8
//                             ? 'bg-cyan-400'
//                             : 'bg-yellow-500'
//                           : 'bg-[#1e2d45]'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                   Creating account...
//                 </span>
//               ) : 'Create account →'}
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-[#64748b]">
//             Already have an account?{' '}
//             <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default RegisterPage

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/endpoints/auth'
import { roleApi } from '../api/endpoints/role'
import { useAuthStore } from '../store/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const dropdownRef = useRef(null)

  const [form, setForm] = useState({ name: '', email: '', password: '', targetJobRole: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Role dropdown state
  const [roles, setRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [roleSearch, setRoleSearch] = useState('')

  // Load all roles on mount
  useEffect(() => {
    roleApi.getAllRoles()
      .then(res => setRoles(res.data))
      .catch(() => setRoles([]))
      .finally(() => setRolesLoading(false))
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
        setRoleSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSelectRole = (role) => {
    setForm({ ...form, targetJobRole: role.title })
    setDropdownOpen(false)
    setRoleSearch('')
    setError('')
  }

  const handleClearRole = () => {
    setForm({ ...form, targetJobRole: '' })
    setRoleSearch('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.register(form)
      login(res.data.token, {
        name: res.data.name,
        email: res.data.email,
        targetJobRole: res.data.targetJobRole,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter roles by search
  const filteredRoles = roles.filter(r =>
    r.title.toLowerCase().includes(roleSearch.toLowerCase())
  )

  // Group roles by experience level
  const grouped = {
    ENTRY: filteredRoles.filter(r => r.experienceLevel === 'ENTRY'),
    MID:   filteredRoles.filter(r => r.experienceLevel === 'MID'),
    SENIOR: filteredRoles.filter(r => r.experienceLevel === 'SENIOR'),
  }

  const levelLabel = { ENTRY: 'Entry Level', MID: 'Mid Level', SENIOR: 'Senior Level' }
  const levelColor = {
    ENTRY:  'text-green-400',
    MID:    'text-blue-400',
    SENIOR: 'text-purple-400',
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center relative overflow-hidden py-8">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#0f1623]/90 backdrop-blur-xl border border-[#1e2d45] rounded-2xl p-8 shadow-2xl shadow-black/60">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-black text-white mb-4 shadow-lg shadow-blue-500/30">
              CC
            </div>
            <h1 className="text-xl font-bold text-white">Start your journey</h1>
            <p className="text-sm text-[#64748b] mt-1">Free. No credit card required.</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
                Full Name
              </label>
              <input
                name="name" type="text" value={form.name}
                onChange={handleChange} placeholder="Yash Gupta" required
                className="w-full px-4 py-3 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white placeholder-[#374151] text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
                Email
              </label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required
                className="w-full px-4 py-3 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white placeholder-[#374151] text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>

            {/* Target Job Role — custom dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
                Target Job Role
                <span className="text-[#475569] normal-case font-normal ml-1">(optional)</span>
              </label>

              {/* Trigger button */}
              <button
                type="button"
                onClick={() => { setDropdownOpen(prev => !prev); setRoleSearch('') }}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-left flex items-center justify-between transition-all ${
                  dropdownOpen
                    ? 'bg-[#141d2e] border-blue-500/60 ring-1 ring-blue-500/30'
                    : 'bg-[#141d2e] border-[#1e2d45] hover:border-[#2e4060]'
                }`}
              >
                <span className={form.targetJobRole ? 'text-white font-medium' : 'text-[#374151]'}>
                  {form.targetJobRole || 'Select your target role...'}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {form.targetJobRole && (
                    <span
                      onClick={e => { e.stopPropagation(); handleClearRole() }}
                      className="text-[#64748b] hover:text-white transition-colors text-base leading-none cursor-pointer"
                    >
                      ×
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 text-[#64748b] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f1623] border border-blue-500/30 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden">

                  {/* Search inside dropdown */}
                  <div className="p-3 border-b border-[#1e2d45]">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={roleSearch}
                        onChange={e => setRoleSearch(e.target.value)}
                        placeholder="Search roles..."
                        autoFocus
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white text-xs placeholder-[#374151] focus:outline-none focus:border-blue-500/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Scrollable role list */}
                  <div className="overflow-y-auto" style={{ maxHeight: '260px' }}>
                    {rolesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
                      </div>
                    ) : filteredRoles.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#475569]">
                        No roles match your search
                      </div>
                    ) : (
                      Object.entries(grouped).map(([level, levelRoles]) =>
                        levelRoles.length === 0 ? null : (
                          <div key={level}>
                            {/* Level group header */}
                            <div className="px-4 py-2 sticky top-0 bg-[#0a0f1a] border-b border-[#1e2d45]">
                              <span className={`text-[10px] font-bold tracking-widest uppercase ${levelColor[level]}`}>
                                {levelLabel[level]}
                              </span>
                            </div>
                            {/* Roles in this level */}
                            {levelRoles.map(role => (
                              <button
                                key={role.id}
                                type="button"
                                onClick={() => handleSelectRole(role)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all hover:bg-blue-600/15 border-b border-[#1e2d45]/50 last:border-0 ${
                                  form.targetJobRole === role.title ? 'bg-blue-600/20' : ''
                                }`}
                              >
                                {/* Selection indicator */}
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  form.targetJobRole === role.title ? 'bg-blue-400' : 'bg-[#374151]'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${
                                    form.targetJobRole === role.title ? 'text-blue-300' : 'text-white'
                                  }`}>
                                    {role.title}
                                  </p>
                                  {role.description && (
                                    <p className="text-[10px] text-[#475569] truncate mt-0.5">
                                      {role.description}
                                    </p>
                                  )}
                                </div>
                                {form.targetJobRole === role.title && (
                                  <span className="text-blue-400 text-xs shrink-0">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )
                      )
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2.5 border-t border-[#1e2d45] bg-[#0a0f1a]">
                    <p className="text-[10px] text-[#374151] text-center">
                      You can change this anytime in your profile
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white placeholder-[#374151] text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${
                      form.password.length >= i * 2
                        ? form.password.length >= 8 ? 'bg-cyan-400' : 'bg-yellow-500'
                        : 'bg-[#1e2d45]'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#64748b]">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}