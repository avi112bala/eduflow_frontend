import React from 'react'
import { MetricCards } from './MetricCards'
import { TodayClasses } from './TodayClasses'
import { Announcements } from './Announcements'
import { MetricCardsSkeleton, ClassCardsSkeleton, AnnouncementsSkeleton } from '../../../components/skeletons/DashboardSkeleton'
import type { ClassItem, IAnnouncement } from '../../../types/dashboard'

interface HomeTabProps {
  totalAttendance: string | null
  classes: ClassItem[]
  announcements?: IAnnouncement[]
  userRole?: string
  isLoading?: boolean
  onSelectClass: (cls: ClassItem) => void
  onViewTimetable: () => void
  onOpenCreateAnnouncement?: () => void
}

export const HomeTab: React.FC<HomeTabProps> = ({
  totalAttendance,
  classes,
  announcements = [],
  userRole = 'student',
  isLoading = false,
  onSelectClass,
  onViewTimetable,
  onOpenCreateAnnouncement
}) => {
  if (isLoading && classes.length === 0 && announcements.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <MetricCardsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ClassCardsSkeleton />
          </div>
          <div className="lg:col-span-5">
            <AnnouncementsSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 3-Card Stat Metrics Row */}
      <MetricCards totalAttendance={totalAttendance} />

      {/* Main Section Grid for Tablet / Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dynamic Today's Classes */}
        <div className="lg:col-span-7">
          <TodayClasses
            classes={classes}
            onSelectClass={onSelectClass}
            onViewTimetable={onViewTimetable}
          />
        </div>

        {/* Right Column: Announcements & Academic Tips */}
        <div className="lg:col-span-5">
          <Announcements
            announcements={announcements}
            userRole={userRole}
            onOpenCreateAnnouncement={onOpenCreateAnnouncement}
          />
        </div>
      </div>
    </div>
  )
}

