import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#080c14] text-[#f0f6ff] overflow-hidden relative">

      {/* Background radial glow — signature element across all pages */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px),
                              linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#1e2d45]/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-black text-white">
            CC
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            CareerCompass
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm text-[#94a3b8] hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-600/25"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          AI-Powered Career Intelligence
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-4xl">
          Know exactly{' '}
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              where you stand
            </span>
          </span>
          <br />
          in your career.
        </h1>

        <p className="mt-6 text-lg text-[#64748b] max-w-xl leading-relaxed">
          Upload your resume. Set a target role. CareerCompass analyzes your
          skill gaps, scores your readiness, and builds a personalized roadmap
          — powered by AI.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 mt-10">
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
          >
            Analyze my career free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 text-[#94a3b8] hover:text-white border border-[#1e2d45] hover:border-[#2e4060] rounded-xl transition-all text-sm font-medium"
          >
            Sign in →
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-5xl w-full text-left">
          {[
            { icon: '🔍', title: 'Skill Gap Analysis', desc: 'See exactly which skills are blocking your next role.' },
            { icon: '📊', title: 'Readiness Score', desc: 'A real 0–100 score based on your actual skill profile.' },
            { icon: '🗺️', title: 'Learning Roadmap', desc: 'AI generates a step-by-step path to job-ready.' },
            { icon: '🤖', title: 'AI Career Mentor', desc: 'Chat with an AI that knows your skills and goals.' },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-2xl border border-[#1e2d45] bg-[#0f1623]/80 backdrop-blur-sm hover:border-blue-500/40 hover:bg-[#141d2e] transition-all group"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-12 mt-16 pt-8 border-t border-[#1e2d45]/60 w-full max-w-2xl justify-center">
          {[
            { value: 'AI-Powered', label: 'Skill Extraction' },
            { value: '0–100', label: 'Readiness Scoring' },
            { value: 'Instant', label: 'Roadmap Generation' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-[#64748b] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default LandingPage