import React from 'react'
import {
  Home,
  Calendar,
  UserCheck,
  Award,
  CreditCard,
  GraduationCap,
  Users,
  LogOut,
  Mail,
  Phone,
  User,
  BookOpen,
  HelpCircle,
  CalendarDays,
  Shield,
  Search,
  Moon,
  Sun
} from 'lucide-react'
import type { TabType } from '../../../types/dashboard'
import type { IUserData } from '../../../apiRequest/studentRequest'
import { useTheme } from '../../../context/ThemeContext'

interface DashboardHeaderProps {
  studentFirstName: string
  batchName: string
  userRole?: string
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  profilePicUrl: string
  fullName: string
  userData: IUserData | null
  showProfileMenu: boolean
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>
  onEditProfile: () => void
  onLogout: () => void
  onOpenParentTab: () => void
  onOpenSearch?: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  studentFirstName,
  batchName,
  userRole = 'student',
  activeTab,
  setActiveTab,
  profilePicUrl,
  fullName,
  userData,
  showProfileMenu,
  setShowProfileMenu,
  onEditProfile,
  onLogout,
  onOpenParentTab,
  onOpenSearch
}) => {
  const { theme, toggleTheme } = useTheme()
  const normalizedRole = (userRole || 'student').toLowerCase()

  // Navigation Items defined per role
  let navItems: Array<{ key: TabType; label: string; icon: React.FC<{ className?: string }> }> = []

  if (normalizedRole === 'teacher') {
    navItems = [
      { key: 'home', label: 'Home', icon: Home },
      { key: 'teacher', label: 'Teacher Portal', icon: GraduationCap },
      { key: 'schedule', label: 'Schedule', icon: Calendar },
      { key: 'attendance', label: 'Attendance', icon: UserCheck },
      { key: 'tests', label: 'Tests & Marks', icon: Award },
      { key: 'study-material', label: 'Materials', icon: BookOpen },
      { key: 'doubts', label: 'Doubts', icon: HelpCircle },
      { key: 'leaves', label: 'Leaves', icon: CalendarDays }
    ]
  } else if (normalizedRole === 'parent') {
    navItems = [
      { key: 'parent', label: 'Children Overview', icon: Users },
      { key: 'home', label: 'Notices', icon: Home },
      { key: 'leaves', label: 'Apply Leave', icon: CalendarDays }
    ]
  } else if (normalizedRole === 'admin') {
    navItems = [
      { key: 'admin', label: 'Admin Dashboard', icon: Shield },
      { key: 'home', label: 'Notices', icon: Home },
      { key: 'teacher', label: 'Faculty Portal', icon: GraduationCap },
      { key: 'schedule', label: 'Schedule', icon: Calendar },
      { key: 'tests', label: 'Tests', icon: Award },
      { key: 'study-material', label: 'Materials', icon: BookOpen },
      { key: 'leaves', label: 'Leaves', icon: CalendarDays }
    ]
  } else {
    // Student
    navItems = [
      { key: 'home', label: 'Home', icon: Home },
      { key: 'schedule', label: 'Schedule', icon: Calendar },
      { key: 'attendance', label: 'Attendance', icon: UserCheck },
      { key: 'tests', label: 'Tests', icon: Award },
      { key: 'study-material', label: 'Study Material', icon: BookOpen },
      { key: 'doubts', label: 'Doubts', icon: HelpCircle },
      { key: 'fees', label: 'Fees', icon: CreditCard },
      { key: 'leaves', label: 'Leaves', icon: CalendarDays }
    ]
  }

  return (
    <div className="pt-3.5 sm:pt-4 px-4 sm:px-6 lg:px-8 pb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80 relative sticky top-0 z-30 shadow-xs transition-colors">
      <div className="flex items-center justify-between w-full md:w-auto gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Hello, {studentFirstName}
            <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/70 dark:to-indigo-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 px-2.5 py-0.5 rounded-full shadow-2xs">
              {normalizedRole}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            {batchName}
          </p>
        </div>

        {/* Mobile Header Actions (Search + Theme + Profile) */}
        <div className="md:hidden flex items-center gap-2">
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              title="Search (Cmd+K)"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-500 flex items-center justify-center bg-slate-100 dark:bg-slate-800"
            >
              <img
                src={profilePicUrl}
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
            </button>

            {/* Mobile Profile Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-fade-in divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-3">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{fullName}</p>
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 capitalize mt-0.5">{normalizedRole} Account</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1.5 mt-1">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      {userData?.email || 'No email registered'}
                    </p>
                    {userData?.phoneNumber && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        {userData.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false)
                        onEditProfile()
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Edit Profile & Password
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false)
                        onLogout()
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tabs - Filtered strictly by User Role */}
      <div className="hidden md:flex items-center flex-wrap gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.key

          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === 'parent') {
                  onOpenParentTab()
                } else {
                  setActiveTab(item.key)
                }
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Right Desktop Utilities (Search + Theme Switcher + Profile Menu) */}
      <div className="hidden md:flex items-center gap-2 relative">
        {/* Command Palette Trigger */}
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold cursor-pointer card-hover-lift transition-all"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Search...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer card-hover-lift transition-all flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-fade-in" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 animate-fade-in" />
          )}
        </button>

        {/* Profile Picture Menu trigger (Desktop) */}
        <button
          type="button"
          onClick={() => setShowProfileMenu((prev) => !prev)}
          className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700 transition-all cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs relative shrink-0">
            <img
              src={profilePicUrl}
              alt={fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
          </div>
          <div className="hidden lg:block text-left pr-1">
            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[110px]">
              {fullName}
            </p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 capitalize">{normalizedRole}</p>
          </div>
        </button>


        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowProfileMenu(false)}
            />
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-fade-in divide-y divide-slate-100 dark:divide-slate-800">
              <div className="p-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{fullName}</p>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 capitalize mt-0.5">{normalizedRole} Account</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1.5 mt-1">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  {userData?.email || 'No email registered'}
                </p>
                {userData?.phoneNumber && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    {userData.phoneNumber}
                  </p>
                )}
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false)
                    onEditProfile()
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Edit Profile & Password
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false)
                    onLogout()
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
