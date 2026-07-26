
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <nav className="relative z-20 flex items-center justify-between px-5 py-3.5 border-b border-[#1e2d45] bg-[#0a0f1a]/90 backdrop-blur-md shrink-0">

      {/* LEFT — Logo */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-blue-500/20">
          CC
        </div>

        <span className="text-base font-bold tracking-tight text-white hidden sm:block">
          CareerCompass
        </span>
      </button>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* User Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141d2e] border border-[#1e2d45]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <span className="text-sm text-[#94a3b8] font-medium hidden sm:block">
            {user?.name}
          </span>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="px-3 py-1.5 text-xs text-[#64748b] hover:text-white border border-[#1e2d45] hover:border-[#2e4060] rounded-lg transition-all font-medium"
        >
          Sign out
        </button>

      </div>
    </nav>
  )
}