import { useState, useRef } from 'react'
import { resumeApi } from '../api/endpoints/resume'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-7 h-7 border-2 border-[#1e2d45] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

function SkillTag({ skill }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
      <span className="w-1 h-1 rounded-full bg-blue-400" />{skill}
    </span>
  )
}

export default function ResumePage() {
  const fileInputRef = useRef(null)
  const analysisRef = useRef(null)  
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [alert, setAlert] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const showAlert = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      showAlert('error', 'Only PDF files are supported.')
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      showAlert('error', 'File size must be under 10MB.')
      return
    }
    setFile(selectedFile)
    setUploadResult(null)
    setAnalysis(null)
    setAlert(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setAlert(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await resumeApi.upload(formData)
      setUploadResult(res.data)
      showAlert('success', res.data.message || 'Resume uploaded successfully.')
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleGetAnalysis = async () => {
    setLoadingAnalysis(true)
    setAnalysis(null)
    try {
      const res = await resumeApi.getAnalysis()
      setAnalysis(res.data)
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'No resume found. Upload one first.')
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Resume</h1>
          <p className="text-sm text-[#64748b] mt-1">Upload your PDF resume to auto-extract skills using AI.</p>
        </div>
        <button
          onClick={handleGetAnalysis}
          disabled={loadingAnalysis}
          className="px-4 py-2 text-xs font-semibold text-cyan-400 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/10 transition-all disabled:opacity-50"
        >
          {loadingAnalysis ? 'Loading...' : 'View current analysis →'}
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`px-4 py-3 rounded-xl border text-sm flex items-center gap-2 ${
          alert.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <span>{alert.type === 'success' ? '✓' : '✕'}</span>{alert.message}
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-6 space-y-4">
        <span className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">Upload Resume</span>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all ${
            dragOver ? 'border-blue-500/60 bg-blue-500/5'
            : file ? 'border-green-500/40 bg-green-500/5'
            : 'border-[#1e2d45] hover:border-blue-500/40 hover:bg-blue-500/5'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${file ? 'bg-green-500/10' : 'bg-[#141d2e]'}`}>
            {file ? '✅' : '📄'}
          </div>
          <div className="text-center">
            {file ? (
              <>
                <p className="text-sm font-semibold text-white">{file.name}</p>
                <p className="text-xs text-[#64748b] mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-white">Drop your PDF here or click to browse</p>
                <p className="text-xs text-[#64748b] mt-1">PDF only · Max 10MB</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
            onChange={e => handleFileSelect(e.target.files[0])} />
        </div>

        <button onClick={handleUpload} disabled={!file || uploading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20">
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading and extracting skills...
            </span>
          ) : file ? 'Upload and extract skills →' : 'Select a PDF to upload'}
        </button>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className="bg-[#0f1623] border border-green-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">✅</span>
            <span className="text-sm font-bold text-white">Upload Successful</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#141d2e] rounded-xl p-3">
              <p className="text-xs text-[#64748b]">File</p>
              <p className="text-sm font-semibold text-white mt-1 truncate">{uploadResult.originalFileName}</p>
            </div>
            <div className="bg-[#141d2e] rounded-xl p-3">
              <p className="text-xs text-[#64748b]">Uploaded</p>
              <p className="text-sm font-semibold text-white mt-1">{formatDate(uploadResult.uploadedAt)}</p>
            </div>
            <div className="bg-[#141d2e] rounded-xl p-3">
              <p className="text-xs text-[#64748b]">Resume ID</p>
              <p className="text-sm font-semibold text-white mt-1">#{uploadResult.resumeId}</p>
            </div>
          </div>
          {/* Auto-trigger analysis after upload */}
          <button onClick={handleGetAnalysis} disabled={loadingAnalysis}
            className="w-full py-2 text-xs font-semibold text-cyan-400 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/10 transition-all disabled:opacity-50">
            {loadingAnalysis ? 'Loading analysis...' : 'View extracted skills & AI summary →'}
          </button>
        </div>
      )}

      {/* Loading analysis */}
      {loadingAnalysis && <Spinner />}

      {analysis && (
        <div ref={analysisRef} className="bg-[#0f1623] border border-[#1e2d45] rounded-2xl p-6 space-y-5 scroll-mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">Resume Analysis</span>
            <span className="text-xs text-[#475569]">{analysis.originalFileName}</span>
          </div>

          {analysis.summary && (
            <div className="bg-[#141d2e] border border-cyan-500/15 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">AI Summary</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">AI</span>
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">{analysis.summary}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">Extracted Skills</span>
              <span className="text-xs text-blue-400 font-semibold">{analysis.extractedSkills?.length || 0} found</span>
            </div>
            {!analysis.extractedSkills?.length ? (
              <p className="text-sm text-[#475569] text-center py-6">No skills were matched in the catalogue from your resume.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {analysis.extractedSkills.map(skill => <SkillTag key={skill} skill={skill} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info card */}
      <div className="bg-blue-600/8 border border-blue-500/15 rounded-2xl p-5 flex gap-4">
        <span className="text-2xl shrink-0">🤖</span>
        <div>
          <p className="text-sm font-semibold text-blue-300 mb-1">How AI skill extraction works</p>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Your PDF text is extracted locally, then sent to the AI model which identifies technical skills.
            Those names are matched against the skills catalogue — only recognized skills are added automatically
            with INTERMEDIATE proficiency. Adjust levels manually in the Skills page.
          </p>
        </div>
      </div>
    </div>
  )
}