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

function Sidebar() {
  return (
    <aside className="w-52 border-r border-[#1e2d45] bg-[#0a0f1a]/60 backdrop-blur-sm flex flex-col py-4 shrink-0 relative z-10">
      <div className="px-3 mb-2">
        <span className="text-[10px] font-semibold text-[#374151] tracking-widest uppercase px-2">
          Navigation
        </span>
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5
            ${isActive
              ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
              : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#141d2e]'
            }`
          }
        >
          <span className="text-base leading-none">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar