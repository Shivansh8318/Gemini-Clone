import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'

function App() {
  const { user, isDarkMode } = useStore()

  useEffect(() => {
    // Initialize dark mode on app load
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      root.style.setProperty('--toast-bg', '#374151')
      root.style.setProperty('--toast-color', '#f9fafb')
    } else {
      root.classList.remove('dark')
      root.style.setProperty('--toast-bg', '#ffffff')
      root.style.setProperty('--toast-color', '#111827')
    }
  }, [isDarkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Routes>
        <Route 
          path="/auth" 
          element={user?.isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} 
        />
        <Route 
          path="/dashboard" 
          element={user?.isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/chat/:id" 
          element={user?.isAuthenticated ? <Chat /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/chat" 
          element={user?.isAuthenticated ? <Chat /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user?.isAuthenticated ? "/chat" : "/auth"} />} 
        />
      </Routes>
    </div>
  )
}

export default App