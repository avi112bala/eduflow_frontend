import { Suspense, lazy } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ROUTES } from './utils/routesEnums'
import { ThemeProvider } from './context/ThemeContext'

// Lazy-loaded route components for performance optimization
const AuthLayout = lazy(() => import('./Pages/authpages/AuthLayout').then((m) => ({ default: m.AuthLayout })))
const StudentDashboard = lazy(() => import('./Pages/dashboard/StudentDashboard').then((m) => ({ default: m.StudentDashboard })))

function App() {
  return (
    <ThemeProvider>
      <ToastContainer position="top-right" autoClose={4000} />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
              <span className="text-xl font-black">E</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="loading loading-spinner text-blue-500 loading-md"></span>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Loading Eduflow...</span>
            </div>
          </div>
        }
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />} />
            <Route path={ROUTES.login} element={<AuthLayout />} />
            <Route path={ROUTES.signup} element={<AuthLayout />} />
            <Route path={ROUTES.forgot_password} element={<AuthLayout />} />
            <Route path={ROUTES.dashboard} element={<StudentDashboard />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>
  )
}

export default App

