import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function GridBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
    </div>
  )
}

function Section2() {
  const features = [
    {
      icon: '📄',
      title: 'Upload Your Resume',
      desc: 'Drop your PDF resume and our AI instantly extracts your technical skills — no manual input needed.',
      step: '01',
      color: 'from-blue-600/20 to-blue-800/10',
      border: 'border-blue-500/20',
      accent: 'text-blue-400',
    },
    {
      icon: '🔍',
      title: 'Analyze Your Gaps',
      desc: 'We compare your skills against your target role requirements and show exactly what is missing — must-haves and nice-to-haves.',
      step: '02',
      color: 'from-cyan-600/20 to-cyan-800/10',
      border: 'border-cyan-500/20',
      accent: 'text-cyan-400',
    },
    {
      icon: '📊',
      title: 'Get Your Score',
      desc: 'A precise 0–100 readiness score tells you exactly how job-ready you are — with AI feedback on what to do next.',
      step: '03',
      color: 'from-purple-600/20 to-purple-800/10',
      border: 'border-purple-500/20',
      accent: 'text-purple-400',
    },
    {
      icon: '🗺️',
      title: 'Follow Your Roadmap',
      desc: 'AI generates a step-by-step personalized learning path from where you are today to where you need to be.',
      step: '04',
      color: 'from-green-600/20 to-green-800/10',
      border: 'border-green-500/20',
      accent: 'text-green-400',
    },
    {
      icon: '🏅',
      title: 'Get Certified',
      desc: 'AI recommends the most impactful certifications specifically for your skill gaps and target role.',
      step: '05',
      color: 'from-yellow-600/20 to-yellow-800/10',
      border: 'border-yellow-500/20',
      accent: 'text-yellow-400',
    },
    {
      icon: '🤖',
      title: 'Chat With Your Mentor',
      desc: 'An AI career mentor that knows your skills, your role, and your gaps — available 24/7 for personalized advice.',
      step: '06',
      color: 'from-pink-600/20 to-pink-800/10',
      border: 'border-pink-500/20',
      accent: 'text-pink-400',
    },
  ]

  return (
    <section className="min-h-screen bg-[#080c14] relative flex flex-col items-center justify-center px-6 py-24">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-800/15 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            From resume to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              job ready
            </span>
            <br />in six steps.
          </h2>
          <p className="mt-4 text-base text-[#64748b] max-w-xl mx-auto leading-relaxed">
            CareerCompass turns your career uncertainty into a clear, data-driven action plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.step}
              className={`relative p-6 rounded-2xl border bg-gradient-to-br ${f.color} ${f.border} hover:-translate-y-1 transition-all group`}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{f.icon}</span>
                <span className={`text-xs font-black ${f.accent} opacity-40 group-hover:opacity-70 transition-opacity`}>
                  {f.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">{f.desc}</p>
              {/* Connecting arrow for last 5 */}
              <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-px h-5 ${f.border.replace('border-', 'bg-')} opacity-30`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Section3() {
  const navigate = useNavigate()
  const stats = [
    { value: 'AI-Powered', label: 'Skill Extraction', desc: 'From your resume automatically' },
    { value: '0–100', label: 'Readiness Score', desc: 'Precise, not vague feedback' },
    { value: 'Real-time', label: 'Gap Analysis', desc: 'Always reflects your latest skills' },
    { value: 'Free', label: 'No card required', desc: 'Start immediately, no friction' },
  ]

  const comparisons = [
    { without: 'Guess which skills to learn', with: 'Know exactly what is missing' },
    { without: 'Generic career advice', with: 'Personalized to your profile' },
    { without: 'No sense of progress', with: 'Track your readiness score over time' },
    { without: 'Random certifications', with: 'AI-recommended for your gaps' },
    { without: 'Figure out projects alone', with: 'AI suggests portfolio projects for your role' },
    { without: 'No one to ask career questions', with: 'AI mentor available 24/7' },
  ]

  return (
    <section className="min-h-screen bg-[#060a11] relative flex flex-col items-center justify-center px-6 py-24">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
      </div>

      <div className="relative z-10 max-w-5xl w-full space-y-20">

        {/* Stats */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Why CareerCompass
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              clarity.
            </span>
          </h2>
          <p className="text-base text-[#64748b] max-w-md mx-auto">
            Stop guessing your career path. Start knowing it.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label}
              className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-5 text-center hover:border-blue-500/30 transition-all hover:-translate-y-0.5">
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1">
                {s.value}
              </div>
              <div className="text-sm font-bold text-white mb-1">{s.label}</div>
              <div className="text-[11px] text-[#475569]">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Before / After comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Without */}
          <div className="bg-[#0f1623] border border-red-500/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold">✕</div>
              <span className="text-sm font-bold text-red-400">Without CareerCompass</span>
            </div>
            <div className="space-y-3">
              {comparisons.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[#1e2d45] last:border-0">
                  <span className="text-red-500/60 mt-0.5 shrink-0 text-sm">✕</span>
                  <span className="text-xs text-[#64748b] leading-relaxed">{c.without}</span>
                </div>
              ))}
            </div>
          </div>

          {/* With */}
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">✓</div>
              <span className="text-sm font-bold text-blue-400">With CareerCompass</span>
            </div>
            <div className="space-y-3">
              {comparisons.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-blue-500/10 last:border-0">
                  <span className="text-blue-400 mt-0.5 shrink-0 text-sm">✓</span>
                  <span className="text-xs text-[#94a3b8] leading-relaxed">{c.with}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Section4() {
  const navigate = useNavigate()
  return (
    <section className="min-h-screen bg-[#080c14] relative flex flex-col items-center justify-center px-6 py-24">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[160px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center space-y-8">

        {/* Glowing logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 blur-2xl opacity-30 rounded-2xl scale-150" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-blue-500/40">
              CC
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Your career clarity
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300">
              starts today.
            </span>
          </h2>
          <p className="mt-5 text-base text-[#64748b] max-w-xl mx-auto leading-relaxed">
            Join CareerCompass. Upload your resume, set your target role,
            and get a complete AI-powered career intelligence report in minutes.
            Completely free — no credit card, ever.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm rounded-2xl transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 w-full sm:w-auto"
          >
            Get started — it's free →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 text-[#94a3b8] hover:text-white border border-[#1e2d45] hover:border-[#2e4060] rounded-2xl transition-all text-sm font-medium w-full sm:w-auto"
          >
            Sign in to existing account
          </button>
        </div>

        {/* Trust line */}
        <p className="text-xs text-[#374151]">
          No credit card · No subscription · No nonsense
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {[
            '✓ AI Skill Extraction',
            '✓ Readiness Score',
            '✓ Learning Roadmap',
            '✓ Cert Recommendations',
            '✓ Portfolio Projects',
            '✓ AI Career Mentor',
          ].map(f => (
            <span key={f}
              className="text-[11px] font-medium text-[#64748b] bg-[#0f1623] border border-[#1e2d45] px-3 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const section2Ref = useRef(null)

  const scrollToSection2 = () => {
    section2Ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-[#080c14] text-[#f0f6ff] overflow-x-hidden">

      {/* ── Section 1 — Hero ─────────────────────────────────────────────── */}
      <div className="min-h-screen relative flex flex-col">
        <GridBg />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#1e2d45]/60 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-black text-white">CC</div>
            <span className="text-lg font-bold tracking-tight text-white">CareerCompass</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm text-[#94a3b8] hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/register')}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-600/25">
              Get Started →
            </button>
          </div>
        </nav>

        {/* Hero content */}
        <main className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 flex-1 justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            AI-Powered Career Intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-4xl">
            Know exactly{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              where you stand
            </span>
            <br />in your career.
          </h1>

          <p className="mt-6 text-lg text-[#64748b] max-w-xl leading-relaxed">
            Upload your resume. Set a target role. CareerCompass analyzes your skill gaps,
            scores your readiness, and builds a personalized roadmap — powered by AI.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <button onClick={() => navigate('/register')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5">
              Analyze my career free
            </button>
            <button onClick={scrollToSection2}
              className="px-6 py-3 text-[#94a3b8] hover:text-white border border-[#1e2d45] hover:border-[#2e4060] rounded-xl transition-all text-sm font-medium">
              See how it works ↓
            </button>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-4xl w-full text-left">
            {[
              { icon: '🔍', title: 'Skill Gap Analysis', desc: 'See exactly which skills are blocking your next role.' },
              { icon: '📊', title: 'Readiness Score', desc: 'A real 0–100 score based on your actual skill profile.' },
              { icon: '🗺️', title: 'Learning Roadmap', desc: 'AI generates a step-by-step path to job-ready.' },
              { icon: '🤖', title: 'AI Career Mentor', desc: 'Chat with an AI that knows your skills and goals.' },
            ].map((f) => (
              <div key={f.title}
                className="p-5 rounded-2xl border border-[#1e2d45] bg-[#0f1623]/80 backdrop-blur-sm hover:border-blue-500/40 hover:bg-[#141d2e] transition-all">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <button onClick={scrollToSection2}
            className="mt-12 flex flex-col items-center gap-1.5 text-[#374151] hover:text-[#64748b] transition-colors animate-bounce">
            <span className="text-[10px] tracking-widest uppercase">Scroll to explore</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </main>
      </div>

      {/* ── Section 2 — How it works ──────────────────────────────────────── */}
      <div ref={section2Ref}>
        <Section2 />
      </div>

      {/* ── Section 3 — Why CareerCompass ────────────────────────────────── */}
      <Section3 />

      {/* ── Section 4 — CTA ──────────────────────────────────────────────── */}
      <Section4 />
    </div>
  )
}