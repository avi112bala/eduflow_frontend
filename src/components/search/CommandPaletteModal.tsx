import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Search,
  X,
  Home,
  Calendar,
  UserCheck,
  Award,
  CreditCard,
  GraduationCap,
  Users,
  BookOpen,
  HelpCircle,
  CalendarDays,
  Shield,
  FileText,
  Moon,
  Sun,
  ArrowRight
} from 'lucide-react'
import type { TabType, IStudyMaterial, IDoubtItem, IAnnouncement } from '../../types/dashboard'
import type { ISubjectClass } from '../../apiRequest/studentRequest'
import { useTheme } from '../../context/ThemeContext'

interface CommandPaletteModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTab: (tab: TabType) => void
  userRole: string
  classList?: ISubjectClass[]
  studyMaterials?: IStudyMaterial[]
  doubtsList?: IDoubtItem[]
  announcements?: IAnnouncement[]
  onOpenAskDoubt?: () => void
  onOpenApplyLeave?: () => void
}

interface SearchItem {
  id: string
  type: 'navigation' | 'action' | 'subject' | 'material' | 'doubt' | 'announcement'
  title: string
  subtitle?: string
  icon: React.FC<{ className?: string }>
  perform: () => void
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  userRole,
  classList = [],
  studyMaterials = [],
  doubtsList = [],
  announcements = [],
  onOpenAskDoubt,
  onOpenApplyLeave
}) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, toggleTheme } = useTheme()
  const normalizedRole = userRole.toLowerCase()

  // Reset and focus when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Build searchable items catalogue
  const allItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = []

    // 1. Navigation items
    items.push({
      id: 'nav-home',
      type: 'navigation',
      title: 'Home Dashboard',
      subtitle: 'Overview, today classes & notices',
      icon: Home,
      perform: () => onSelectTab('home')
    })
    items.push({
      id: 'nav-schedule',
      type: 'navigation',
      title: 'Class Schedule & Timetable',
      subtitle: 'Weekly routine & lecture timings',
      icon: Calendar,
      perform: () => onSelectTab('schedule')
    })
    items.push({
      id: 'nav-attendance',
      type: 'navigation',
      title: 'Attendance Tracker',
      subtitle: 'Subject percentage & records',
      icon: UserCheck,
      perform: () => onSelectTab('attendance')
    })
    items.push({
      id: 'nav-tests',
      type: 'navigation',
      title: 'Tests & Marks',
      subtitle: 'Scorecards, rank analysis & tests list',
      icon: Award,
      perform: () => onSelectTab('tests')
    })
    items.push({
      id: 'nav-materials',
      type: 'navigation',
      title: 'Study Materials & DPP',
      subtitle: 'Lecture notes, DPPs & formula sheets',
      icon: BookOpen,
      perform: () => onSelectTab('study-material')
    })
    items.push({
      id: 'nav-doubts',
      type: 'navigation',
      title: 'Doubt Clearing Desk',
      subtitle: 'Ask concepts & faculty answers',
      icon: HelpCircle,
      perform: () => onSelectTab('doubts')
    })

    if (normalizedRole === 'student') {
      items.push({
        id: 'nav-fees',
        type: 'navigation',
        title: 'Fee Overview & Payments',
        subtitle: 'Dues breakdown & online payment receipt',
        icon: CreditCard,
        perform: () => onSelectTab('fees')
      })
    }

    items.push({
      id: 'nav-leaves',
      type: 'navigation',
      title: 'Leave Applications',
      subtitle: 'Apply leave & track status',
      icon: CalendarDays,
      perform: () => onSelectTab('leaves')
    })

    if (normalizedRole === 'teacher' || normalizedRole === 'admin') {
      items.push({
        id: 'nav-teacher',
        type: 'navigation',
        title: 'Faculty Portal',
        subtitle: 'Manage marks, attendance & materials',
        icon: GraduationCap,
        perform: () => onSelectTab('teacher')
      })
    }

    if (normalizedRole === 'parent') {
      items.push({
        id: 'nav-parent',
        type: 'navigation',
        title: 'Guardian Overview',
        subtitle: 'Ward attendance, tests & fee payment',
        icon: Users,
        perform: () => onSelectTab('parent')
      })
    }

    if (normalizedRole === 'admin') {
      items.push({
        id: 'nav-admin',
        type: 'navigation',
        title: 'Institute Administration',
        subtitle: 'Analytics, batches & fee defaulters',
        icon: Shield,
        perform: () => onSelectTab('admin')
      })
    }

    // 2. Quick Actions
    items.push({
      id: 'act-theme',
      type: 'action',
      title: `Switch Theme to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Toggle interface appearance',
      icon: theme === 'dark' ? Sun : Moon,
      perform: () => toggleTheme()
    })

    if (onOpenAskDoubt && normalizedRole !== 'teacher' && normalizedRole !== 'admin') {
      items.push({
        id: 'act-ask-doubt',
        type: 'action',
        title: 'Ask a New Doubt',
        subtitle: 'Post a question directly to faculty',
        icon: HelpCircle,
        perform: () => {
          onSelectTab('doubts')
          onOpenAskDoubt()
        }
      })
    }

    if (onOpenApplyLeave) {
      items.push({
        id: 'act-apply-leave',
        type: 'action',
        title: 'Submit Leave Application',
        subtitle: 'Request leave from classes',
        icon: CalendarDays,
        perform: () => {
          onSelectTab('leaves')
          onOpenApplyLeave()
        }
      })
    }

    // 3. Subjects
    classList.forEach((cls) => {
      items.push({
        id: `subj-${cls._id}`,
        type: 'subject',
        title: cls.name,
        subtitle: cls.description || 'Subject Course Module',
        icon: BookOpen,
        perform: () => onSelectTab('study-material')
      })
    })

    // 4. Study Materials
    studyMaterials.forEach((mat) => {
      items.push({
        id: `mat-${mat._id}`,
        type: 'material',
        title: mat.title,
        subtitle: `${mat.subjectName || 'Material'} • ${mat.materialType || 'Lecture Notes'}`,
        icon: FileText,
        perform: () => onSelectTab('study-material')
      })
    })

    // 5. Announcements
    announcements.forEach((ann) => {
      items.push({
        id: `ann-${ann._id || ann.id || ann.title}`,
        type: 'announcement',
        title: ann.title,
        subtitle: `Announcement: ${(ann.description || '').slice(0, 50)}...`,
        icon: Home,
        perform: () => onSelectTab('home')
      })
    })

    // 6. Doubts
    doubtsList.forEach((d) => {
      items.push({
        id: `dbt-${d._id}`,
        type: 'doubt',
        title: d.title,
        subtitle: `Doubt • ${d.doubt.slice(0, 45)}...`,
        icon: HelpCircle,
        perform: () => onSelectTab('doubts')
      })
    })

    return items
  }, [
    normalizedRole,
    theme,
    onSelectTab,
    toggleTheme,
    onOpenAskDoubt,
    onOpenApplyLeave,
    classList,
    studyMaterials,
    announcements,
    doubtsList
  ])

  // Filter items by query
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8)
    const q = query.toLowerCase()
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    )
  }, [allItems, query])

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].perform()
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a command, subject, material, or navigate..."
            className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 rounded-md">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              No matching results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.perform()
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {item.type}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↵</kbd> Select
            </span>
          </div>
          <span>Eduflow Command Palette</span>
        </div>
      </div>
    </div>
  )
}
