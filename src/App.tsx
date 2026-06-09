import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'styled-components'
import AdminDashboard from './admin-dashboard/AdminDashboard'
import OrganizerDashboard from './organizer-dashboard/OrganizerDashboard'
import { theme } from './admin-dashboard/styles/theme'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Admin Dashboard Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* Organizer Dashboard Routes */}
          <Route path="/organizer/*" element={<OrganizerDashboard />} />
          {/* Default redirect to admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
