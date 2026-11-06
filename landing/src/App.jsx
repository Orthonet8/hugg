import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import AboutPage from './pages/AboutPage'
import BackgroundPage from './pages/BackgroundPage'
import BlackPage from './pages/BlackPage'
import HomePage from './pages/HomePage'

function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.href = to
  }, [to])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<ExternalRedirect to="/app/login" />} />
        <Route path="/register" element={<ExternalRedirect to="/app/login?mode=signup" />} />
        <Route path="/app" element={<ExternalRedirect to="/app/" />} />
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlackPage />} />
          <Route path="/black" element={<Navigate to="/blog" replace />} />
          <Route path="/background" element={<BackgroundPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
