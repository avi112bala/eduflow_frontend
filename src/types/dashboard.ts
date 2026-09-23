export type TabType =
  | 'home'
  | 'schedule'
  | 'attendance'
  | 'tests'
  | 'study-material'
  | 'doubts'
  | 'leaves'
  | 'fees'
  | 'teacher'
  | 'parent'
  | 'admin'

export interface ClassItem {
  id: string
  subject: string
  time: string
  title: string
  location: string
  color: string
  badgeBg: string
  badgeText: string
  barColor: string
  liveMeetingUrl?: string
  teacherName?: string
  dayOfWeek?: string
}

export interface PaymentMeta {
  feeType: string
  feeAmount: string
}

export interface IAnnouncement {
  _id?: string
  id?: string
  title: string
  description: string
  priority: 'CRITICAL' | 'NORMAL' | 'TIP' | string
  targetRole?: 'all' | 'student' | 'parent' | 'teacher' | string
  createdAt?: string
  date?: string
}

export interface ITestItem {
  _id?: string
  id?: string
  testName: string
  subjectID: string
  subjectName?: string
  testtype: string
  totalmarks: string | number
  testDuration: string
  date: string
}

export interface ITestResult {
  testId: string
  testName: string
  subject: string
  marksObtained: number
  totalMarks: number
  rank?: number
  percentile?: number
  accuracy?: number
  date: string
  remarks?: string
}

export interface ILeaderboardEntry {
  rank: number
  studentName: string
  studentId?: string
  score: number
  totalMarks: number
  avatar?: string
}

export interface IQuizQuestion {
  id: string
  question: string
  options: string[]
  correctOptionIndex: number // 0-based
  subject: string
  topic: string
  points: number
  negativePoints?: number
  explanation?: string
}

export interface ITopicAnalysis {
  topic: string
  subject: string
  totalQuestions: number
  correctCount: number
  accuracy: number
  isWeak: boolean
}

export interface IQuizResultAnalysis {
  testId: string
  testName: string
  subject: string
  totalMarks: number
  marksObtained: number
  accuracy: number
  timeSpentSeconds: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  unattempted: number
  topicBreakdown: ITopicAnalysis[]
  questionReview: Array<{
    question: IQuizQuestion
    selectedOptionIndex?: number
    isCorrect: boolean
  }>
}

export interface ISubmitQuizPayload {
  testId: string
  studentId: string
  studentName?: string
  answers: Record<string, number>
  timeSpentSeconds: number
}

export interface IStudyMaterial {
  _id: string
  title: string
  subjectId: string | { _id: string; name: string; description?: string }
  subjectName?: string
  materialType: 'notes' | 'assignment' | 'video_link' | 'dpp' | string
  resourseUrl?: string
  fileUrl?: string
  description?: string
  duedate?: string
  dueDate?: string
  uploadedBy?: string
  createdAt?: string
}

export interface IDoubtItem {
  _id: string
  subjectId: string | { _id: string; name: string; description?: string }
  subjectName?: string
  userId: string | { _id: string; firstName: string; lastName: string; email?: string }
  userName?: string
  studentId?: string
  studentName?: string
  title: string
  doubt: string
  questionText?: string
  doubtType?: 'pending' | 'resolved' | string
  status?: string
  media?: string
  imageUrl?: string
  answeredBy?: string
  answerText?: string
  solutionImageUrl?: string
  createdAt?: string
  answeredAt?: string
  __v?: number
}

export interface ILeaveItem {
  _id: string
  studentId: string
  studentName: string
  appliedBy: 'student' | 'parent'
  startDate: string
  endDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewedBy?: string
  remarks?: string
  createdAt: string
}

export interface IFeeTransaction {
  transactionId: string
  feeType: string
  amount: number | string
  status: 'PAID' | 'PENDING' | 'FAILED'
  paymentDate: string
  receiptUrl?: string
  paymentMethod?: string
}

export interface IFeeOverview {
  totalTuitionFee: number
  paidAmount: number
  dueAmount: number
  nextDueDate: string
}

export interface IBatchItem {
  _id: string
  batchName: string
  timing: string
  room: string
  studentCount?: number
  activeSubjectCount?: number
}

export interface IAdminAnalytics {
  totalStudents: number
  totalTeachers: number
  overallAttendanceToday: number
  feesCollectedThisMonth: number
  activeBatches: number
  pendingLeaves: number
}
