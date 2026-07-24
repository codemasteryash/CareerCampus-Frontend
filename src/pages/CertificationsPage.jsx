import { useState, useEffect } from 'react'
import { certificationApi } from '../api/endpoints/certification'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

const DIFFICULTY_STYLES = {
  BEGINNER: 'bg-green-500/10 border-green-500/20 text-green-400',
  INTERMEDIATE: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  ADVANCED: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
}

const STATUS_STYLES = {
  IN_PROGRESS: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  COMPLETED: 'bg-green-500/10 border-green-500/20 text-green-400',
}

function Alert({ type, message, onClose }) {
  return (
    <div className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-between ${
      type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      <span className="flex items-center gap-2">
        <span>{type === 'success' ? '✓' : '✕'}</span>
        {message}
      </span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">×</button>
    </div>
  )
}

export default function CertificationsPage() {
  const [recommendations, setRecommendations] = useState([])
  const [myCerts, setMyCerts] = useState([])
  const [loadingRec, setLoadingRec] = useState(false)
  const [loadingMy, setLoadingMy] = useState(true)
  const [enrolling, setEnrolling] = useState(null)
  const [removing, setRemoving] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [alert, setAlert] = useState(null)
  const [activeTab, setActiveTab] = useState('recommendations')

  const showAlert = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  useEffect(() => {
    certificationApi.getMyCertifications()
      .then(res => setMyCerts(res.data))
      .catch(() => showAlert('error', 'Failed to load your certifications.'))
      .finally(() => setLoadingMy(false))
  }, [])

  const loadRecommendations = async () => {
    setLoadingRec(true)
    try {
      const res = await certificationApi.getRecommendations()
      setRecommendations(res.data)
      setActiveTab('recommendations')
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to load recommendations. Make sure your target role is set.')
    } finally {
      setLoadingRec(false)
    }
  }

  const handleEnroll = async (cert) => {
    setEnrolling(cert.name)
    try {
      const res = await certificationApi.enroll({
        certificationName: cert.name,
        provider: cert.provider,
        url: cert.url || '',
      })
      setMyCerts(prev => [...prev, res.data])
      showAlert('success', `Enrolled in "${cert.name}" successfully.`)
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Already enrolled or failed to enroll.')
    } finally {
      setEnrolling(null)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setUpdatingStatus(id)
    try {
      const payload = status === 'COMPLETED'
        ? { status, completedAt: new Date().toISOString().split('T')[0] }
        : { status }
      const res = await certificationApi.updateStatus(id, payload)
      setMyCerts(prev => prev.map(c => c.id === id ? res.data : c))
      showAlert('success', status === 'COMPLETED' ? 'Marked as completed! 🎉' : 'Status updated.')
    } catch {
      showAlert('error', 'Failed to update status.')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleRemove = async (id) => {
    setRemoving(id)
    try {
      await certificationApi.remove(id)
      setMyCerts(prev => prev.filter(c => c.id !== id))
      showAlert('success', 'Certification removed.')
    } catch {
      showAlert('error', 'Failed to remove certification.')
    } finally {
      setRemoving(null)
    }
  }

  const enrolledNames = new Set(myCerts.map(c => c.certificationName))

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Certifications</h1>
          <p className="text-sm text-[#64748b] mt-1">AI-powered recommendations based on your skill gaps.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#0f1623] border border-[#1e2d45] text-xs text-[#94a3b8]">
            {myCerts.filter(c => c.status === 'COMPLETED').length} completed
          </div>
          <button
            onClick={loadRecommendations}
            disabled={loadingRec}
            className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/20"
          >
            {loadingRec ? 'Getting AI picks...' : '✨ Get AI recommendations'}
          </button>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0f1623] border border-[#1e2d45] rounded-xl w-fit">
        {[
          { key: 'recommendations', label: `Recommendations (${recommendations.length})` },
          { key: 'mine', label: `My Certifications (${myCerts.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations tab */}
      {activeTab === 'recommendations' && (
        <div>
          {loadingRec && <Spinner />}

          {!loadingRec && recommendations.length === 0 && (
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-12 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/20 flex items-center justify-center text-3xl">
                🏅
              </div>
              <div>
                <p className="text-base font-bold text-white mb-2">Get AI-powered certification picks</p>
                <p className="text-sm text-[#64748b] max-w-md leading-relaxed">
                  Click the button above to get 5 certifications recommended specifically for your
                  skill gaps and target role — with reasons why each one helps.
                </p>
              </div>
            </div>
          )}

          {!loadingRec && recommendations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map((cert, i) => {
                const alreadyEnrolled = enrolledNames.has(cert.name)
                return (
                  <div
                    key={i}
                    className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-5 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white leading-snug pr-2">{cert.name}</h3>
                        <p className="text-xs text-[#64748b] mt-0.5">{cert.provider}</p>
                      </div>
                      {cert.difficulty && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${DIFFICULTY_STYLES[cert.difficulty] || DIFFICULTY_STYLES.INTERMEDIATE}`}>
                          {cert.difficulty[0] + cert.difficulty.slice(1).toLowerCase()}
                        </span>
                      )}
                    </div>

                    {cert.reason && (
                      <div className="bg-[#141d2e] rounded-xl p-3 mb-4">
                        <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                          <span className="text-cyan-400 font-semibold">Why: </span>
                          {cert.reason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Official page →
                        </a>
                      )}
                      <div className="flex-1" />
                      {alreadyEnrolled ? (
                        <span className="text-[11px] text-green-400 font-semibold">✓ Enrolled</span>
                      ) : (
                        <button
                          onClick={() => handleEnroll(cert)}
                          disabled={enrolling === cert.name}
                          className="px-3 py-1.5 text-[11px] font-semibold bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          {enrolling === cert.name ? 'Enrolling...' : '+ Enroll'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* My Certifications tab */}
      {activeTab === 'mine' && (
        <div>
          {loadingMy && <Spinner />}

          {!loadingMy && myCerts.length === 0 && (
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-12 flex flex-col items-center gap-4 text-center">
              <span className="text-4xl">📋</span>
              <div>
                <p className="text-base font-bold text-white mb-1">No certifications tracked yet</p>
                <p className="text-sm text-[#64748b]">Get AI recommendations and enroll to start tracking your progress.</p>
              </div>
              <button
                onClick={() => { setActiveTab('recommendations'); loadRecommendations() }}
                className="px-4 py-2 text-xs font-semibold text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/10 transition-all"
              >
                Get recommendations →
              </button>
            </div>
          )}

          {!loadingMy && myCerts.length > 0 && (
            <div className="space-y-3">
              {myCerts.map(cert => (
                <div
                  key={cert.id}
                  className={`bg-[#0f1623] border rounded-2xl p-5 transition-all ${
                    cert.status === 'COMPLETED' ? 'border-green-500/20' : 'border-[#1e2d45] hover:border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white">{cert.certificationName}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[cert.status]}`}>
                          {cert.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed ✓'}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-0.5">{cert.provider}</p>
                      {cert.completedAt && (
                        <p className="text-[10px] text-green-400 mt-1">
                          Completed: {new Date(cert.completedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Link →
                        </a>
                      )}
                      {cert.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleUpdateStatus(cert.id, 'COMPLETED')}
                          disabled={updatingStatus === cert.id}
                          className="px-3 py-1.5 text-[11px] font-semibold bg-green-500/15 border border-green-500/25 text-green-400 rounded-lg hover:bg-green-500/25 transition-all disabled:opacity-50"
                        >
                          {updatingStatus === cert.id ? '...' : 'Mark complete ✓'}
                        </button>
                      )}
                      {cert.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateStatus(cert.id, 'IN_PROGRESS')}
                          disabled={updatingStatus === cert.id}
                          className="px-3 py-1.5 text-[11px] font-semibold text-[#475569] border border-[#1e2d45] rounded-lg hover:text-[#64748b] transition-all disabled:opacity-50"
                        >
                          {updatingStatus === cert.id ? '...' : 'Reopen'}
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(cert.id)}
                        disabled={removing === cert.id}
                        className="w-7 h-7 flex items-center justify-center text-[#374151] hover:text-red-400 transition-colors disabled:opacity-50 text-lg"
                        title="Remove"
                      >
                        {removing === cert.id ? '...' : '×'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}