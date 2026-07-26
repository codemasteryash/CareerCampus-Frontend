
import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/profile', label: 'Profile', icon: '◎' },
  { path: '/skills', label: 'My Skills', icon: '◈' },
  { path: '/resume', label: 'Resume', icon: '◧' },
  { path: '/analysis', label: 'Analysis', icon: '◉' },
  { path: '/roadmap', label: 'Roadmap', icon: '⬡' },
  { path: '/certifications', label: 'Certifications', icon: '◑' },
  { path: '/projects', label: 'Projects', icon: '◆' },
  { path: '/mentor', label: 'AI Mentor', icon: '◈' },
  { path: '/roles', label: 'Browse Roles', icon: '◎' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          shrink-0
          flex
          flex-col
          bg-[#0a0f1a]
          border-r
          border-[#1e2d45]
          overflow-hidden
          transition-all
          duration-300
          ease-in-out
          ${open ? 'w-52 min-w-[208px]' : 'w-0 min-w-0 border-r-0'}
        `}
      >
        <div className="w-52 flex flex-col h-full py-4">
          <div className="px-3 mb-2">
            <span className="text-[10px] font-semibold text-[#374151] tracking-widest uppercase px-2">
              Navigation
            </span>
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose()
              }}
              className={({ isActive }) =>
                `flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 whitespace-nowrap
                ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#141d2e]'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  )
}