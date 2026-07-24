import { useState, useEffect } from 'react'
import { userApi } from '../api/endpoints/user'
import { useAuthStore } from '../store/authStore'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

function Alert({ type, message }) {
  const styles = {
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
  }
  return (
    <div className={`px-4 py-3 rounded-xl border text-sm flex items-center gap-2 ${styles[type]}`}>
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1e2d45] last:border-0">
      <span className="text-xs font-semibold text-[#64748b] tracking-wide uppercase">{label}</span>
      <span className="text-sm text-[#94a3b8] font-medium">{value || '—'}</span>
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [form, setForm] = useState({ name: '', targetJobRole: '' })
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    userApi.getProfile()
      .then(res => {
        setProfile(res.data)
        setForm({ name: res.data.name, targetJobRole: res.data.targetJobRole || '' })
      })
      .catch(() => setAlert({ type: 'error', message: 'Failed to load profile.' }))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!form.name.trim()) {
      setAlert({ type: 'error', message: 'Name cannot be empty.' })
      return
    }
    setSaving(true)
    setAlert(null)
    try {
      const res = await userApi.updateProfile(form)
      setProfile(res.data)
      updateUser({ name: res.data.name, targetJobRole: res.data.targetJobRole })
      setAlert({ type: 'success', message: 'Profile updated successfully.' })
      setEditing(false)
    } catch {
      setAlert({ type: 'error', message: 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({ name: profile.name, targetJobRole: profile.targetJobRole || '' })
    setEditing(false)
    setAlert(null)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  if (loading) return <Spinner />

  const initials = profile?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Profile</h1>
        <p className="text-sm text-[#64748b] mt-1">Manage your account details and target role.</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Profile Card */}
      <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl overflow-hidden">

        {/* Avatar banner */}
        <div className="h-24 bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-cyan-900/30 relative">
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-black text-white border-4 border-[#0f1623] shadow-xl">
              {initials}
            </div>
          </div>
        </div>

        <div className="pt-12 px-6 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">{profile?.name}</h2>
              <p className="text-sm text-[#64748b]">{profile?.email}</p>
              {profile?.targetJobRole && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                  🎯 {profile.targetJobRole}
                </span>
              )}
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-xs font-semibold text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/10 transition-all"
              >
                Edit profile
              </button>
            )}
          </div>

          {/* Read-only info */}
          {!editing ? (
            <div className="space-y-0">
              <InfoRow label="Full name" value={profile?.name} />
              <InfoRow label="Email address" value={profile?.email} />
              <InfoRow label="Target job role" value={profile?.targetJobRole || 'Not set'} />
              <InfoRow label="Member since" value={formatDate(profile?.createdAt)} />
              <InfoRow label="Last updated" value={formatDate(profile?.updatedAt)} />
            </div>
          ) : (
            /* Edit form */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
                  Target Job Role
                </label>
                <input
                  type="text"
                  value={form.targetJobRole}
                  onChange={e => setForm({ ...form, targetJobRole: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#141d2e] border border-[#1e2d45] text-white text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  placeholder="e.g. Backend Developer, Data Scientist..."
                />
                <p className="text-xs text-[#475569] mt-1.5">
                  This must match a role in the system exactly — check Browse Roles for valid names.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 tracking-wide uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile?.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0f1a] border border-[#1e2d45] text-[#475569] text-sm cursor-not-allowed"
                />
                <p className="text-xs text-[#475569] mt-1.5">Email cannot be changed here.</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-sm font-medium text-[#64748b] hover:text-white border border-[#1e2d45] hover:border-[#2e4060] rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tip card */}
      <div className="bg-blue-600/8 border border-blue-500/15 rounded-2xl p-5 flex gap-4">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <p className="text-sm font-semibold text-blue-300 mb-1">Set your target role to unlock everything</p>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Your target job role drives your skill gap analysis, readiness score, roadmap generation,
            and AI certification recommendations. Make sure it exactly matches a role available in
            Browse Roles — for example "Backend Developer" or "Frontend Developer".
          </p>
        </div>
      </div>

    </div>
  )
}