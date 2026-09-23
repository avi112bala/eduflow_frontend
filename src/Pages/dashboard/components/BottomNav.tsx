import React from 'react'
import {
  Home,
  Calendar,
  UserCheck,
  Award,
  GraduationCap,
  Users,
  BookOpen,
  HelpCircle,
  Shield,
  CalendarDays
} from 'lucide-react'
import type { TabType } from '../../../types/dashboard'

interface BottomNavProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  userRole?: string
  onOpenParentTab?: () => void
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  userRole = 'student',
  onOpenParentTab
}) => {
  const normalizedRole = userRole.toLowerCase()

  // Dynamic tabs based strictly on authenticated role
  let tabs: Array<{ key: TabType; label: string; icon: React.FC<{ className?: string }> }> = []

  if (normalizedRole === 'teacher') {
    tabs = [
      { key: 'home', label: 'Home', icon: Home },
      { key: 'teacher', label: 'Portal', icon: GraduationCap },
      { key: 'attendance', label: 'Attend', icon: UserCheck },
      { key: 'tests', label: 'Tests', icon: Award },
      { key: 'doubts', label: 'Doubts', icon: HelpCircle }
    ]
  } else if (normalizedRole === 'parent') {
    tabs = [
      { key: 'parent', label: 'Children', icon: Users },
      { key: 'home', label: 'Notices', icon: Home },
      { key: 'leaves', label: 'Leaves', icon: CalendarDays }
    ]
  } else if (normalizedRole === 'admin') {
    tabs = [
      { key: 'admin', label: 'Admin', icon: Shield },
      { key: 'home', label: 'Notices', icon: Home },
      { key: 'teacher', label: 'Faculty', icon: GraduationCap },
      { key: 'tests', label: 'Tests', icon: Award },
      { key: 'leaves', label: 'Leaves', icon: CalendarDays }
    ]
  } else {
    // Default student tabs
    tabs = [
      { key: 'home', label: 'Home', icon: Home },
      { key: 'schedule', label: 'Schedule', icon: Calendar },
      { key: 'study-material', label: 'Study', icon: BookOpen },
      { key: 'tests', label: 'Tests', icon: Award },
      { key: 'doubts', label: 'Doubts', icon: HelpCircle }
    ]
  }

  const handleTabClick = (tabKey: TabType) => {
    if (tabKey === 'parent' && onOpenParentTab) {
      onOpenParentTab()
    } else {
      setActiveTab(tabKey)
    }
  }

  const gridColsClass =
    tabs.length === 3 ? 'grid-cols-3' : tabs.length === 4 ? 'grid-cols-4' : 'grid-cols-5'

  return (
    <div
      className={`md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 py-1.5 px-1 grid ${gridColsClass} items-center absolute bottom-0 left-0 right-0 z-40 shadow-lg`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.key

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabClick(tab.key)}
            className={`flex flex-col items-center justify-center min-w-0 w-full py-1 px-0.5 rounded-xl cursor-pointer transition-all duration-150 ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
            </div>
            <span className="text-[9.5px] sm:text-[10px] leading-tight truncate w-full text-center block mt-0.5 tracking-tight">
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
