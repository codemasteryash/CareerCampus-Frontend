
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 relative z-10 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Collapse Rail */}
        <div className="w-12 bg-[#0a0f1a] border-r border-[#1e2d45] flex justify-center pt-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="
              h-9
              w-9
              rounded-lg
              flex
              items-center
              justify-center
              text-[#94a3b8]
              hover:bg-[#141d2e]
              hover:text-white
              transition-all
              duration-200
            "
          >
            {sidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}