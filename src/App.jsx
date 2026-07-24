import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import SkillsPage from './pages/SkillsPage'
import RolesPage from './pages/RolesPage'
import ResumePage from './pages/ResumePage'
import AnalysisPage from './pages/AnalysisPage'
import RoadmapPage from './pages/RoadmapPage'
import CertificationsPage from './pages/CertificationsPage'
import ProjectsPage from './pages/ProjectsPage'
import MentorPage from './pages/MentorPage'

import Layout from './components/layout/Layout'
import ProtectedRoute from './components/shared/ProtectedRoute'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/mentor" element={<MentorPage />} />
        </Route>
      </Route>


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App