import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-[#1e2d45] bg-[#0a0f1a]/80 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white">
          CC
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          CareerCompass
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141d2e] border border-[#1e2d45]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm text-[#94a3b8] font-medium">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs text-[#64748b] hover:text-white border border-[#1e2d45] hover:border-[#2e4060] rounded-lg transition-all font-medium"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}

export default Navbar