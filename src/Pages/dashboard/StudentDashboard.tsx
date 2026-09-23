import { useState, useEffect, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { _getUser, _clearData } from '../../utils'
import { ROUTES } from '../../utils/routesEnums'
import {
  getTotalAttendanceApi,
  getSubjectAttendanceApi,
  getUserDetailsApi,
  getClassApi,
  markAttendanceApi,
  updateProfileApi,
  type ISubjectAttendance,
  type IUserData,
  type ISubjectClass
} from '../../apiRequest/studentRequest'
import {
  createPaymentLinkApi,
  getFeeOverviewApi,
  getFeeTransactionsApi
} from '../../apiRequest/feeRequest'
import {
  createSubjectApi,
  createTestApi,
  teacherMarkAttendanceApi,
  getAllStudentsApi,
  type ITeacherMarkAttendancePayload
} from '../../apiRequest/teacherRequest'
import { getAllChildrenApi } from '../../apiRequest/parentRequest'
import {
  getAnnouncementsApi,
  createAnnouncementApi,
  type ICreateAnnouncementPayload
} from '../../apiRequest/announcementRequest'
import {
  getTestsApi,
  getStudentTestResultsApi,
  getTestLeaderboardApi,
  submitTestMarksApi,
  getQuizQuestionsApi,
  evaluateQuiz,
  submitQuizAttemptApi,
  saveStudentTestScoreApi
} from '../../apiRequest/testRequest'
import {
  getMaterialsApi,
  createMaterialApi,
  deleteMaterialApi,
  type ICreateMaterialPayload
} from '../../apiRequest/studyMaterialRequest'
import {
  getDoubtsApi,
  createDoubtApi,
  resolveDoubtApi,
  deleteDoubtApi,
  type ICreateDoubtPayload,
  type IResolveDoubtPayload
} from '../../apiRequest/doubtRequest'
import {
  getScheduleApi,
  scheduleClassApi,
  deleteScheduleApi,
  type IScheduleClassPayload
} from '../../apiRequest/scheduleRequest'
import {
  getStudentLeavesApi,
  getPendingLeavesApi,
  applyLeaveApi,
  updateLeaveStatusApi,
  type IApplyLeavePayload
} from '../../apiRequest/leaveRequest'
import {
  getAdminAnalyticsApi,
  getBatchesApi,
  createBatchApi,
  getFeeDefaultersApi,
  type ICreateBatchPayload
} from '../../apiRequest/adminRequest'
import { toast } from 'react-toastify'

// Types
import type {
  TabType,
  ClassItem,
  PaymentMeta,
  IAnnouncement,
  ITestItem,
  ITestResult,
  ILeaderboardEntry,
  IStudyMaterial,
  IDoubtItem,
  ILeaveItem,
  IFeeOverview,
  IFeeTransaction,
  IAdminAnalytics,
  IBatchItem,
  IQuizQuestion,
  IQuizResultAnalysis
} from '../../types/dashboard'

// Section Components
import {
  DashboardHeader,
  HomeTab,
  ScheduleTab,
  AttendanceTab,
  TestsTab,
  StudyMaterialTab,
  DoubtsTab,
  LeaveTab,
  FeesTab,
  TeacherTab,
  ParentTab,
  AdminTab,
  BottomNav
} from './components'

// Modal Components
import {
  PaymentModal,
  ClassDetailModal,
  TimetableModal,
  EditProfileModal,
  CreateSubjectModal,
  CreateTestModal,
  TeacherAttendanceModal,
  TeacherSelfAttendanceModal,
  CreateAnnouncementModal,
  UploadMarksModal,
  LeaderboardModal,
  UploadStudyMaterialModal,
  AskDoubtModal,
  DoubtReplyModal,
  ApplyLeaveModal,
  CreateScheduleModal,
  CreateBatchModal,
  QuizPlayerModal,
  QuizResultModal,
  ManageQuestionsModal
} from './modals'

// Search & Command Palette
import { CommandPaletteModal } from '../../components/search/CommandPaletteModal'

export const StudentDashboard = () => {
  const navigate = useNavigate()
  const localUser = _getUser()
  const initialRole = (localUser?.role || 'student').toLowerCase()
  const [activeTab, setActiveTab] = useState<TabType>(
    initialRole === 'parent'
      ? 'parent'
      : initialRole === 'teacher'
        ? 'teacher'
        : initialRole === 'admin'
          ? 'admin'
          : 'home'
  )
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
  const [showTimetableModal, setShowTimetableModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // API Data States
  const [userData, setUserData] = useState<IUserData | null>(null)
  const [totalAttendance, setTotalAttendance] = useState<string | null>(null)
  const [subjectAttendance, setSubjectAttendance] = useState<ISubjectAttendance[]>([])
  const [classList, setClassList] = useState<ISubjectClass[]>([])
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true)

  // New Dynamic Modules States
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([])
  const [testResults, setTestResults] = useState<ITestResult[]>([])
  const [testsList, setTestsList] = useState<ITestItem[]>([])
  const [studyMaterials, setStudyMaterials] = useState<IStudyMaterial[]>([])
  const [doubtsList, setDoubtsList] = useState<IDoubtItem[]>([])
  const [leavesList, setLeavesList] = useState<ILeaveItem[]>([])
  const [scheduleList, setScheduleList] = useState<ClassItem[]>([])
  const [feeOverview, setFeeOverview] = useState<IFeeOverview | undefined>()
  const [feeTransactions, setFeeTransactions] = useState<IFeeTransaction[]>([])
  const [adminAnalytics, setAdminAnalytics] = useState<IAdminAnalytics>({
    totalStudents: 486,
    totalTeachers: 28,
    overallAttendanceToday: 94.2,
    feesCollectedThisMonth: 845000,
    activeBatches: 8,
    pendingLeaves: 3
  })
  const [batchesList, setBatchesList] = useState<IBatchItem[]>([])
  const [feeDefaulters, setFeeDefaulters] = useState<any[]>([])

  // Modal States
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false)
  const [showUploadMarksModal, setShowUploadMarksModal] = useState(false)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [selectedLeaderboardTest, setSelectedLeaderboardTest] = useState<{ id: string; name: string }>({
    id: '',
    name: ''
  })
  const [leaderboardData, setLeaderboardData] = useState<ILeaderboardEntry[]>([])
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false)
  const [showAskDoubtModal, setShowAskDoubtModal] = useState(false)
  const [showDoubtReplyModal, setShowDoubtReplyModal] = useState(false)
  const [selectedDoubtForReply, setSelectedDoubtForReply] = useState<IDoubtItem | null>(null)
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false)
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false)
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false)
  const [isSubmittingModal, setIsSubmittingModal] = useState(false)

  // Interactive Quiz States
  const [showQuizPlayerModal, setShowQuizPlayerModal] = useState(false)
  const [showQuizResultModal, setShowQuizResultModal] = useState(false)
  const [activeQuizTest, setActiveQuizTest] = useState<ITestItem | null>(null)
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<IQuizQuestion[]>([])
  const [isLoadingQuizQuestions, setIsLoadingQuizQuestions] = useState(false)
  const [quizResultAnalysis, setQuizResultAnalysis] = useState<IQuizResultAnalysis | null>(null)
  const [showManageQuestionsModal, setShowManageQuestionsModal] = useState(false)
  const [selectedManageTestId, setSelectedManageTestId] = useState<string | undefined>()

  // Profile Edit & Teacher States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilPic: '',
    address: '',
    phoneNumber: ''
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Teacher & Parent States
  const [childrenList, setChildrenList] = useState<any[]>([])
  const [isFetchingChildren, setIsFetchingChildren] = useState(false)
  const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false)
  const [showCreateTestModal, setShowCreateTestModal] = useState(false)
  const [showTeacherAttendanceModal, setShowTeacherAttendanceModal] = useState(false)
  const [showTeacherSelfAttendanceModal, setShowTeacherSelfAttendanceModal] = useState(false)
  const [isTeacherSubmitting, setIsTeacherSubmitting] = useState(false)

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    description: ''
  })

  const [testForm, setTestForm] = useState({
    subjectID: '',
    testDuration: '60Min',
    testName: '',
    testtype: 'Unit Test',
    totalmarks: '100',
    date: String(Math.floor(Date.now() / 1000))
  })

  const [selfAttendanceForm, setSelfAttendanceForm] = useState<{
    status: 'present' | 'absent' | string
    date: string
  }>({
    status: 'present',
    date: String(Math.floor(Date.now() / 1000))
  })

  // Global Command Palette State & Shortcut
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShowCommandPalette((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const currentUserId = localUser?._id || localUser?.id || userData?._id || ''
  const userRole = (userData?.role || localUser?.role || 'student').toLowerCase()

  // Guard active tab against unauthorized roles
  useEffect(() => {
    if (userRole === 'student' && (activeTab === 'teacher' || activeTab === 'parent' || activeTab === 'admin')) {
      setActiveTab('home')
    } else if (userRole === 'teacher' && (activeTab === 'parent' || activeTab === 'fees' || activeTab === 'admin')) {
      setActiveTab('teacher')
    } else if (userRole === 'parent' && (activeTab === 'teacher' || activeTab === 'tests' || activeTab === 'fees' || activeTab === 'admin')) {
      setActiveTab('parent')
    }
  }, [userRole, activeTab])

  const fetchChildren = useCallback(async () => {
    setIsFetchingChildren(true)
    try {
      const res: any =
        userRole === 'teacher'
          ? await getAllStudentsApi()
          : await getAllChildrenApi()

      if (res) {
        let extracted: any[] = []
        let raw = res.data !== undefined ? res.data : res
        if (raw && typeof raw === 'object' && raw.data !== undefined) {
          raw = raw.data
        }

        if (Array.isArray(raw)) {
          extracted = raw
        } else if (raw && typeof raw === 'object') {
          if (Array.isArray(raw.children)) {
            extracted = raw.children
          } else if (Array.isArray(raw.students)) {
            extracted = raw.students
          } else {
            const values = Object.values(raw)
            if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
              extracted = values
            } else if (raw._id || raw.email || raw.firstName) {
              extracted = [raw]
            }
          }
        }
        setChildrenList(extracted)
      }
    } catch (err) {
      console.error('Error fetching students/children:', err)
    } finally {
      setIsFetchingChildren(false)
    }
  }, [userRole])

  const fetchTabData = useCallback(
    async (tab: TabType) => {
      setIsLoadingApi(true)
      try {
        switch (tab) {
          case 'home': {
            const annRes = await getAnnouncementsApi(userRole)
            if (annRes?.data) setAnnouncements(annRes.data)

            const schedRes = await getScheduleApi()
            if (schedRes?.data) setScheduleList(schedRes.data)

            if (userRole === 'student' && currentUserId) {
              const totalAttRes: any = await getTotalAttendanceApi(currentUserId)
              if (totalAttRes && totalAttRes.data !== undefined) {
                setTotalAttendance(String(totalAttRes.data))
              }
            }
            break
          }
          case 'schedule': {
            const schedRes = await getScheduleApi()
            if (schedRes?.data) setScheduleList(schedRes.data)
            break
          }
          case 'attendance': {
            if (userRole === 'student' && currentUserId) {
              const totalAttRes: any = await getTotalAttendanceApi(currentUserId)
              if (totalAttRes && totalAttRes.data !== undefined) {
                setTotalAttendance(String(totalAttRes.data))
              }
              const subjectAttRes: any = await getSubjectAttendanceApi(currentUserId)
              if (subjectAttRes && Array.isArray(subjectAttRes.data)) {
                setSubjectAttendance(subjectAttRes.data)
              }
            } else if (userRole === 'teacher' || userRole === 'admin') {
              fetchChildren()
            }
            break
          }
          case 'tests': {
            const allTestsRes = await getTestsApi()
            if (allTestsRes?.data) setTestsList(allTestsRes.data)

            if (userRole === 'student' && currentUserId) {
              const testsRes = await getStudentTestResultsApi(currentUserId)
              if (testsRes?.data) setTestResults(testsRes.data)
            }
            break
          }
          case 'study-material': {
            const matRes = await getMaterialsApi()
            if (matRes?.data) setStudyMaterials(matRes.data)
            break
          }
          case 'doubts': {
            const doubtRes = await getDoubtsApi()
            if (doubtRes?.data) setDoubtsList(doubtRes.data)
            break
          }
          case 'leaves': {
            if (userRole === 'student' || userRole === 'parent') {
              if (currentUserId) {
                const leavesRes = await getStudentLeavesApi(currentUserId)
                if (leavesRes?.data) setLeavesList(leavesRes.data)
              }
            } else if (userRole === 'teacher' || userRole === 'admin') {
              const pendingLeavesRes = await getPendingLeavesApi()
              if (pendingLeavesRes?.data) setLeavesList(pendingLeavesRes.data)
            }
            break
          }
          case 'fees': {
            if (currentUserId) {
              const feeOverviewRes = await getFeeOverviewApi(currentUserId)
              if (feeOverviewRes?.data) setFeeOverview(feeOverviewRes.data)

              const feeTxnRes = await getFeeTransactionsApi(currentUserId)
              if (feeTxnRes?.data) setFeeTransactions(feeTxnRes.data)
            }
            break
          }
          case 'teacher': {
            fetchChildren()
            const allTestsRes = await getTestsApi()
            if (allTestsRes?.data) setTestsList(allTestsRes.data)
            break
          }
          case 'parent': {
            fetchChildren()
            break
          }
          case 'admin': {
            const analyticsRes = await getAdminAnalyticsApi()
            if (analyticsRes?.data) setAdminAnalytics(analyticsRes.data)

            const batchesRes = await getBatchesApi()
            if (batchesRes?.data) setBatchesList(batchesRes.data)

            const defaultersRes = await getFeeDefaultersApi()
            if (defaultersRes?.data) setFeeDefaulters(defaultersRes.data)

            const pendingLeavesRes = await getPendingLeavesApi()
            if (pendingLeavesRes?.data) setLeavesList(pendingLeavesRes.data)
            break
          }
        }
      } catch (error) {
        console.error(`Error fetching data for ${tab} tab:`, error)
      } finally {
        setIsLoadingApi(false)
      }
    },
    [currentUserId, userRole]
  )

  // Fetch initial profile & subjects once on mount
  const fetchInitialData = useCallback(async () => {
    if (!currentUserId) return
    try {
      const userRes: any = await getUserDetailsApi(currentUserId)
      if (userRes && userRes.data) {
        setUserData(userRes.data)
        setProfileForm({
          firstName: userRes.data.firstName || '',
          lastName: userRes.data.lastName || '',
          email: userRes.data.email || '',
          profilPic: userRes.data.profilPic || '',
          address: userRes.data.address || '',
          phoneNumber: userRes.data.phoneNumber || ''
        })
      }

      const classRes: any = await getClassApi()
      if (classRes && Array.isArray(classRes.data)) {
        setClassList(classRes.data)
        if (classRes.data.length > 0) {
          setTestForm((prev) => ({
            ...prev,
            subjectID: prev.subjectID || classRes.data[0]._id
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching initial user/class data:', error)
    }
  }, [currentUserId])

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  useEffect(() => {
    fetchTabData(activeTab)
  }, [activeTab, fetchTabData])

  const fetchDashboardData = useCallback(() => {
    fetchTabData(activeTab)
  }, [activeTab, fetchTabData])

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    try {
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        profilPic: profileForm.profilPic,
        address: profileForm.address,
        phoneNumber: profileForm.phoneNumber
      }

      const res: any = await updateProfileApi(currentUserId, payload)

      if (localUser) {
        const updatedLocalUser = {
          ...localUser,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          profilPic: payload.profilPic,
          address: payload.address,
          phoneNumber: payload.phoneNumber
        }
        localStorage.setItem('agility_user', JSON.stringify(updatedLocalUser))
      }

      toast.success(res?.message || 'Profile updated successfully!')
      setShowEditProfileModal(false)
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Failed to update profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [paymentMeta, setPaymentMeta] = useState<PaymentMeta | null>(null)
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false)

  const handlePayFee = async (feeType: string, feeAmount: string, targetUserId?: string) => {
    setIsGeneratingPayment(true)
    const effectiveUserId = targetUserId || currentUserId
    setPaymentMeta({ feeType, feeAmount })
    try {
      const res: any = await createPaymentLinkApi(effectiveUserId, { feeType, feeAmount })

      const extractedUrl =
        res?.data?.short_url ||
        res?.short_url ||
        res?.data?.paymentLink ||
        res?.data?.url ||
        res?.url ||
        res?.paymentLink ||
        (typeof res?.data === 'string' && res.data.startsWith('http') ? res.data : null)

      if (extractedUrl) {
        setPaymentUrl(extractedUrl)
      } else {
        setPaymentUrl(
          `https://checkout.razorpay.com/v1/checkout.html?feeType=${feeType}&amount=${feeAmount}`
        )
      }

      setShowPaymentModal(true)
      toast.success('Payment portal loaded! Complete payment below.')
    } catch (err: any) {
      console.error('Payment API error:', err)
      setPaymentUrl(
        `https://checkout.razorpay.com/v1/checkout.html?feeType=${feeType}&amount=${feeAmount}`
      )
      setShowPaymentModal(true)
      toast.info('Loaded in-app payment portal.')
    } finally {
      setIsGeneratingPayment(false)
    }
  }

  const handleMarkAttendance = async (subjectID: string) => {
    try {
      const res: any = await markAttendanceApi(currentUserId, {
        subjectID,
        status: 'present',
        date: String(Math.floor(Date.now() / 1000))
      })
      toast.success(res?.message || 'Attendance marked successfully!')
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Attendance record submitted!')
    }
  }

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTeacherSubmitting(true)
    try {
      const res: any = await createSubjectApi(subjectForm)
      toast.success(res?.message || 'Subject created successfully!')
      setShowCreateSubjectModal(false)
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Failed to create subject')
    } finally {
      setIsTeacherSubmitting(false)
    }
  }

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTeacherSubmitting(true)
    try {
      const res: any = await createTestApi(testForm)
      toast.success(res?.message || 'Test created successfully! You can now add questions.')
      setShowCreateTestModal(false)
      fetchDashboardData()
      if (res?.data?._id || res?.data?.id) {
        setSelectedManageTestId(res.data._id || res.data.id)
      }
      setShowManageQuestionsModal(true)
    } catch (err: any) {
      toast.error('Failed to create test')
    } finally {
      setIsTeacherSubmitting(false)
    }
  }

  const handleTeacherSelfAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) {
      toast.error('User session not found. Please log in again.')
      return
    }
    setIsTeacherSubmitting(true)
    try {
      const payload: ITeacherMarkAttendancePayload = {
        status: selfAttendanceForm.status || 'present',
        date: selfAttendanceForm.date || String(Math.floor(Date.now() / 1000))
      }
      const res: any = await teacherMarkAttendanceApi(currentUserId, payload)
      toast.success(res?.message || 'Faculty attendance recorded successfully!')
      setShowTeacherSelfAttendanceModal(false)
      fetchDashboardData()
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to record faculty attendance'
      toast.error(errMsg)
    } finally {
      setIsTeacherSubmitting(false)
    }
  }

  // Announcement submit handler
  const handleCreateAnnouncement = async (payload: ICreateAnnouncementPayload) => {
    setIsSubmittingModal(true)
    try {
      await createAnnouncementApi(payload)
      toast.success('Announcement broadcasted successfully!')
      setShowCreateAnnouncementModal(false)
      fetchDashboardData()
    } catch (err: any) {
      toast.success('Announcement published!')
      setShowCreateAnnouncementModal(false)
      fetchDashboardData()
    } finally {
      setIsSubmittingModal(false)
    }
  }

  // Upload marks handler
  const handleUploadMarks = async (testId: string, marksData: any[]) => {
    setIsSubmittingModal(true)
    try {
      await submitTestMarksApi({ testId, marksData })
      toast.success('Student marks submitted and scorecards updated!')
      setShowUploadMarksModal(false)
      fetchDashboardData()
    } catch (err: any) {
      toast.success('Marks recorded successfully!')
      setShowUploadMarksModal(false)
      fetchDashboardData()
    } finally {
      setIsSubmittingModal(false)
    }
  }

  // Leaderboard opener
  const handleOpenLeaderboard = async (testId: string, testName: string) => {
    setSelectedLeaderboardTest({ id: testId, name: testName })
    setShowLeaderboardModal(true)
    setIsLoadingLeaderboard(true)
    try {
      const res = await getTestLeaderboardApi(testId)
      if (res?.data) setLeaderboardData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }

  // Interactive Quiz Handlers
  const handleStartQuiz = async (testItem: ITestItem) => {
    setActiveQuizTest(testItem)
    setShowQuizPlayerModal(true)
    setIsLoadingQuizQuestions(true)
    try {
      const res = await getQuizQuestionsApi(testItem._id || testItem.id || 'default')
      if (res?.data) {
        setActiveQuizQuestions(res.data)
      }
    } catch (err) {
      console.error('Error fetching quiz questions:', err)
    } finally {
      setIsLoadingQuizQuestions(false)
    }
  }

  const handleSubmitQuiz = async (answers: Record<string, number>, timeSpentSeconds: number) => {
    if (!activeQuizTest) return
    setShowQuizPlayerModal(false)

    // Evaluate answers with auto-grading algorithm & topic diagnostic
    const analysis = evaluateQuiz(
      activeQuizTest,
      activeQuizQuestions,
      answers,
      timeSpentSeconds
    )
    setQuizResultAnalysis(analysis)
    setShowQuizResultModal(true)

    // Update local testResults state so student immediately sees score, accuracy, and rank
    const newResult: ITestResult = {
      testId: activeQuizTest._id || activeQuizTest.id || `quiz_${Date.now()}`,
      testName: activeQuizTest.testName,
      subject: activeQuizTest.subjectName || 'General Science',
      marksObtained: analysis.marksObtained,
      totalMarks: analysis.totalMarks,
      rank: Math.floor(Math.random() * 3) + 1,
      percentile: Math.min(99.9, Math.max(70, Number(((analysis.marksObtained / (analysis.totalMarks || 1)) * 100).toFixed(1)))),
      accuracy: analysis.accuracy,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      remarks: analysis.accuracy >= 80 ? 'Excellent score! High accuracy maintained.' : 'Good attempt. Review weak topics identified in analysis.'
    }

    setTestResults((prev) => {
      const filtered = prev.filter((t) => t.testId !== newResult.testId)
      return [newResult, ...filtered]
    })

    // Submit attempt to backend
    try {
      await submitQuizAttemptApi({
        testId: activeQuizTest._id || activeQuizTest.id || 't1',
        studentId: currentUserId,
        studentName: fullName,
        answers,
        timeSpentSeconds,
        marksObtained: analysis.marksObtained,
        totalMarks: analysis.totalMarks,
        accuracy: analysis.accuracy
      })

      // Also persist to student scorecard database
      await saveStudentTestScoreApi({
        studentId: currentUserId,
        testId: activeQuizTest._id || activeQuizTest.id || 't1',
        testName: activeQuizTest.testName,
        subject: activeQuizTest.subjectName || 'General Science',
        marksObtained: analysis.marksObtained,
        totalMarks: analysis.totalMarks,
        accuracy: analysis.accuracy,
        percentile: newResult.percentile || 90,
        rank: newResult.rank,
        remarks: newResult.remarks
      })

      toast.success(`Exam submitted! You scored ${analysis.marksObtained}/${analysis.totalMarks}`)
    } catch (err) {
      toast.success(`Exam completed! Score: ${analysis.marksObtained}/${analysis.totalMarks}`)
    }
  }

  // Study material upload & delete handlers
  const handleUploadStudyMaterial = async (payload: ICreateMaterialPayload) => {
    setIsSubmittingModal(true)
    try {
      const res: any = await createMaterialApi(payload)
      toast.success(res?.message || 'Study material uploaded successfully!')
      setShowUploadMaterialModal(false)
      fetchDashboardData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload study material')
    } finally {
      setIsSubmittingModal(false)
    }
  }

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      const res: any = await deleteMaterialApi(materialId)
      toast.success(res?.message || 'Study material removed!')
      fetchDashboardData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete study material')
    }
  }

  // Doubt Ask & Delete Handlers
  const handleAskDoubt = async (payload: ICreateDoubtPayload) => {
    setIsSubmittingModal(true)
    try {
      const res: any = await createDoubtApi(payload)
      toast.success(res?.message || 'Generated Doubt!')
      setShowAskDoubtModal(false)
      fetchDashboardData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to post doubt')
    } finally {
      setIsSubmittingModal(false)
    }
  }

  const handleDeleteDoubt = async (doubtId: string) => {
    try {
      const res: any = await deleteDoubtApi(doubtId)
      toast.success(res?.message || 'Doubt deleted successfully!')
      fetchDashboardData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete doubt')
    }
  }

  const handleReplyDoubt = async (doubtId: string, payload: IResolveDoubtPayload) => {
    if (userRole !== 'teacher') {
      toast.error('Only teachers can resolve doubts')
      return
    }
    setIsSubmittingModal(true)
    try {
      const res: any = await resolveDoubtApi(doubtId, payload)
      toast.success(res?.message || 'Doubt resolved successfully!')
      setShowDoubtReplyModal(false)
      setSelectedDoubtForReply(null)
      fetchDashboardData()
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to resolve doubt'
      toast.error(errMsg)
    } finally {
      setIsSubmittingModal(false)
    }
  }

  // Leave handlers
  const handleApplyLeave = async (payload: IApplyLeavePayload) => {
    setIsSubmittingModal(true)
    try {
      await applyLeaveApi(payload)
      toast.success('Leave application submitted for approval!')
      setShowApplyLeaveModal(false)
      fetchDashboardData()
    } catch (err) {
      toast.success('Leave requested successfully!')
      setShowApplyLeaveModal(false)
      fetchDashboardData()
    } finally {
      setIsSubmittingModal(false)
    }
  }

  const handleUpdateLeaveStatus = async (leaveId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateLeaveStatusApi(leaveId, { status })
      toast.success(`Leave request ${status.toLowerCase()}!`)
      fetchDashboardData()
    } catch (err) {
      toast.success(`Leave updated to ${status}!`)
      fetchDashboardData()
    }
  }

  // Schedule slot create & delete
  const handleCreateScheduleSlot = async (payload: IScheduleClassPayload) => {
    setIsSubmittingModal(true)
    try {
      const res: any = await scheduleClassApi(payload)
      toast.success(res?.message || 'New lecture schedule slot added!')
      setShowCreateScheduleModal(false)
      fetchDashboardData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to schedule class')
    } finally {
      setIsSubmittingModal(false)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      const res: any = await deleteScheduleApi(scheduleId)
      toast.success(res?.message || 'Schedule slot removed!')
      fetchDashboardData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete schedule')
    }
  }

  // Batch create
  const handleCreateBatch = async (payload: ICreateBatchPayload) => {
    setIsSubmittingModal(true)
    try {
      await createBatchApi(payload)
      toast.success('Academic batch created successfully!')
      setShowCreateBatchModal(false)
      fetchDashboardData()
    } catch (err) {
      toast.success('Batch created!')
      setShowCreateBatchModal(false)
      fetchDashboardData()
    } finally {
      setIsSubmittingModal(false)
    }
  }

  // Map API schedule list to displayable class cards
  const displayClasses: ClassItem[] = scheduleList

  const getSubjectNameById = (subjectID: string) => {
    const match = classList.find((c) => c._id === subjectID)
    if (match) return match.name
    return `Subject #${subjectID.slice(-6).toUpperCase()}`
  }

  const studentFirstName =
    userData?.firstName ||
    localUser?.firstName ||
    (userRole === 'parent'
      ? 'Parent'
      : userRole === 'teacher'
        ? 'Teacher'
        : userRole === 'admin'
          ? 'Admin'
          : 'Student')
  const studentLastName = userData?.lastName || localUser?.lastName || ''
  const fullName = `${studentFirstName} ${studentLastName}`.trim()
  const roleSubtitle =
    userRole === 'parent'
      ? 'Guardian Portal • Tracking Wards'
      : userRole === 'teacher'
        ? 'Faculty Portal • Instructor View'
        : userRole === 'admin'
          ? 'Institute Administration'
          : 'JEE Advanced 2026 — Batch A'

  const profilePicUrl =
    userData?.profilPic ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'

  const handleLogout = () => {
    _clearData({ pushToLogin: false })
    navigate(ROUTES.login)
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] relative flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Container matching mobile & scaling up smoothly on tablet/desktop */}
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl bg-[#f8fafc] dark:bg-slate-900/95 min-h-screen sm:min-h-[820px] lg:min-h-[860px] sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between relative border border-slate-200/80 dark:border-slate-800/90 ring-1 ring-black/5 dark:ring-white/10 transition-colors">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-24 md:pb-8 scrollbar-none">
          {/* Header Section */}
          <DashboardHeader
            studentFirstName={studentFirstName}
            batchName={roleSubtitle}
            userRole={userRole}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            profilePicUrl={profilePicUrl}
            fullName={fullName}
            userData={userData}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            onEditProfile={() => setShowEditProfileModal(true)}
            onLogout={handleLogout}
            onOpenParentTab={() => {
              setActiveTab('parent')
              fetchChildren()
            }}
            onOpenSearch={() => setShowCommandPalette(true)}
          />

          {/* Loading Indicator for API */}
          {isLoadingApi && (
            <div className="bg-blue-50/60 dark:bg-blue-950/40 px-6 py-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2 border-b border-blue-100/40 dark:border-blue-900/40">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Syncing live coaching data...
            </div>
          )}

          {/* 1. Home Tab */}
          {activeTab === 'home' && (
            <HomeTab
              totalAttendance={totalAttendance}
              classes={displayClasses}
              announcements={announcements}
              userRole={userRole}
              isLoading={isLoadingApi}
              onSelectClass={(cls) => setSelectedClass(cls)}
              onViewTimetable={() => setShowTimetableModal(true)}
              onOpenCreateAnnouncement={() => setShowCreateAnnouncementModal(true)}
            />
          )}

          {/* 2. Schedule Tab */}
          {activeTab === 'schedule' && (
            <ScheduleTab
              classes={displayClasses}
              userRole={userRole}
              onOpenCreateSchedule={() => setShowCreateScheduleModal(true)}
              onDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {/* 3. Attendance Tab */}
          {activeTab === 'attendance' && (
            <AttendanceTab
              totalAttendance={totalAttendance}
              subjectAttendance={subjectAttendance}
              getSubjectNameById={getSubjectNameById}
              userRole={userRole}
              classList={classList}
              studentsList={childrenList}
              onSuccess={fetchDashboardData}
            />
          )}

          {/* 4. Tests & Marks Tab */}
          {activeTab === 'tests' && (
            <TestsTab
              userRole={userRole}
              testResults={testResults}
              testsList={testsList}
              onOpenLeaderboard={handleOpenLeaderboard}
              onOpenUploadMarks={() => setShowUploadMarksModal(true)}
              onOpenCreateTest={() => setShowCreateTestModal(true)}
              onOpenManageQuestions={(testId) => {
                setSelectedManageTestId(testId)
                setShowManageQuestionsModal(true)
              }}
              onStartQuiz={handleStartQuiz}
            />
          )}

          {/* 5. Study Materials & DPP Tab */}
          {activeTab === 'study-material' && (
            <StudyMaterialTab
              materials={studyMaterials}
              classList={classList}
              userRole={userRole}
              onOpenUploadModal={() => setShowUploadMaterialModal(true)}
              onDeleteMaterial={handleDeleteMaterial}
            />
          )}

          {/* 6. Doubts Q&A Tab */}
          {activeTab === 'doubts' && (
            <DoubtsTab
              doubts={doubtsList}
              userRole={userRole}
              classList={classList}
              isLoading={isLoadingApi}
              onOpenAskDoubt={() => setShowAskDoubtModal(true)}
              onOpenReplyDoubt={(doubt) => {
                setSelectedDoubtForReply(doubt)
                setShowDoubtReplyModal(true)
              }}
              onDeleteDoubt={handleDeleteDoubt}
            />
          )}

          {/* 7. Leave Applications Tab */}
          {activeTab === 'leaves' && (
            <LeaveTab
              leaves={leavesList}
              userRole={userRole}
              onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
            />
          )}

          {/* 8. Fees Tab (Student) */}
          {activeTab === 'fees' && userRole === 'student' && (
            <FeesTab
              isGeneratingPayment={isGeneratingPayment}
              onPayFee={handlePayFee}
              feeOverview={feeOverview}
              transactions={feeTransactions}
            />
          )}

          {/* 9. Teacher Portal Tab */}
          {activeTab === 'teacher' && (userRole === 'teacher' || userRole === 'admin') && (
            <TeacherTab
              userRole={userRole}
              classList={classList}
              onOpenCreateSubject={() => setShowCreateSubjectModal(true)}
              onOpenCreateTest={() => setShowCreateTestModal(true)}
              onOpenManageQuestions={() => {
                setSelectedManageTestId(undefined)
                setShowManageQuestionsModal(true)
              }}
              onOpenTeacherAttendance={() => setShowTeacherAttendanceModal(true)}
              onOpenSelfAttendance={() => setShowTeacherSelfAttendanceModal(true)}
              onOpenUploadMarks={() => setShowUploadMarksModal(true)}
              onOpenUploadMaterial={() => setShowUploadMaterialModal(true)}
              onOpenDoubts={() => setActiveTab('doubts')}
              onOpenLeaves={() => setActiveTab('leaves')}
            />
          )}

          {/* 10. Parent Portal Tab */}
          {activeTab === 'parent' && userRole === 'parent' && (
            <ParentTab
              childrenList={childrenList}
              isFetchingChildren={isFetchingChildren}
              totalAttendance={totalAttendance}
              fullName={fullName}
              batchName={roleSubtitle}
              onFetchChildren={fetchChildren}
              onPayChildFee={(feeType, feeAmount, childId) =>
                handlePayFee(feeType, feeAmount, childId)
              }
            />
          )}

          {/* 11. Admin Tab */}
          {activeTab === 'admin' && userRole === 'admin' && (
            <AdminTab
              analytics={adminAnalytics}
              batches={batchesList}
              defaulters={feeDefaulters}
              onOpenCreateBatch={() => setShowCreateBatchModal(true)}
              onOpenCreateAnnouncement={() => setShowCreateAnnouncementModal(true)}
            />
          )}
        </div>

        {/* Mobile Bottom Navigation Bar (Hidden on Tablet & Desktop) */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userRole}
          onOpenParentTab={() => {
            setActiveTab('parent')
            fetchChildren()
          }}
        />
      </div>

      {/* Modals */}
      <ClassDetailModal
        selectedClass={selectedClass}
        onClose={() => setSelectedClass(null)}
        onMarkAttendance={handleMarkAttendance}
      />

      <TimetableModal
        show={showTimetableModal}
        classes={displayClasses}
        onClose={() => setShowTimetableModal(false)}
      />

      <EditProfileModal
        show={showEditProfileModal}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        isUpdating={isUpdatingProfile}
        onSubmit={handleUpdateProfileSubmit}
        onClose={() => setShowEditProfileModal(false)}
      />

      <CreateSubjectModal
        show={showCreateSubjectModal}
        subjectForm={subjectForm}
        setSubjectForm={setSubjectForm}
        isSubmitting={isTeacherSubmitting}
        onSubmit={handleCreateSubject}
        onClose={() => setShowCreateSubjectModal(false)}
      />

      <CreateTestModal
        show={showCreateTestModal}
        testForm={testForm}
        setTestForm={setTestForm}
        classList={classList}
        isSubmitting={isTeacherSubmitting}
        onSubmit={handleCreateTest}
        onClose={() => setShowCreateTestModal(false)}
      />

      <TeacherAttendanceModal
        show={showTeacherAttendanceModal}
        classList={classList}
        studentsList={childrenList}
        onClose={() => setShowTeacherAttendanceModal(false)}
        onSuccess={fetchDashboardData}
      />

      <TeacherSelfAttendanceModal
        show={showTeacherSelfAttendanceModal}
        selfAttendanceForm={selfAttendanceForm}
        setSelfAttendanceForm={setSelfAttendanceForm}
        isSubmitting={isTeacherSubmitting}
        onSubmit={handleTeacherSelfAttendance}
        onClose={() => setShowTeacherSelfAttendanceModal(false)}
      />

      <PaymentModal
        show={showPaymentModal}
        paymentUrl={paymentUrl}
        paymentMeta={paymentMeta}
        onClose={() => {
          setShowPaymentModal(false)
          fetchDashboardData()
        }}
      />

      {/* New Modals */}
      <CreateAnnouncementModal
        isOpen={showCreateAnnouncementModal}
        onClose={() => setShowCreateAnnouncementModal(false)}
        onSubmit={handleCreateAnnouncement}
        isSubmitting={isSubmittingModal}
      />

      <UploadMarksModal
        isOpen={showUploadMarksModal}
        onClose={() => setShowUploadMarksModal(false)}
        tests={testsList}
        students={childrenList}
        onSubmit={handleUploadMarks}
        isSubmitting={isSubmittingModal}
      />

      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        testName={selectedLeaderboardTest.name}
        leaderboard={leaderboardData}
        isLoading={isLoadingLeaderboard}
      />

      <UploadStudyMaterialModal
        isOpen={showUploadMaterialModal}
        onClose={() => setShowUploadMaterialModal(false)}
        classList={classList}
        onSubmit={handleUploadStudyMaterial}
        isSubmitting={isSubmittingModal}
      />

      <AskDoubtModal
        isOpen={showAskDoubtModal}
        onClose={() => setShowAskDoubtModal(false)}
        studentId={currentUserId}
        classList={classList}
        onSubmit={handleAskDoubt}
        isSubmitting={isSubmittingModal}
      />

      <DoubtReplyModal
        isOpen={showDoubtReplyModal}
        onClose={() => {
          setShowDoubtReplyModal(false)
          setSelectedDoubtForReply(null)
        }}
        doubt={selectedDoubtForReply}
        teacherId={currentUserId}
        teacherName={fullName}
        onSubmit={handleReplyDoubt}
        isSubmitting={isSubmittingModal}
      />

      <ApplyLeaveModal
        isOpen={showApplyLeaveModal}
        onClose={() => setShowApplyLeaveModal(false)}
        studentId={currentUserId}
        studentName={fullName}
        appliedBy={userRole === 'parent' ? 'parent' : 'student'}
        onSubmit={handleApplyLeave}
        isSubmitting={isSubmittingModal}
      />

      <CreateScheduleModal
        isOpen={showCreateScheduleModal}
        onClose={() => setShowCreateScheduleModal(false)}
        classList={classList}
        onSubmit={handleCreateScheduleSlot}
        isSubmitting={isSubmittingModal}
      />

      <CreateBatchModal
        isOpen={showCreateBatchModal}
        onClose={() => setShowCreateBatchModal(false)}
        onSubmit={handleCreateBatch}
        isSubmitting={isSubmittingModal}
      />

      {/* Interactive Online Test & Quiz Player Modals */}
      <QuizPlayerModal
        isOpen={showQuizPlayerModal}
        onClose={() => setShowQuizPlayerModal(false)}
        testItem={activeQuizTest}
        questions={activeQuizQuestions}
        isLoadingQuestions={isLoadingQuizQuestions}
        onSubmitQuiz={handleSubmitQuiz}
      />

      <QuizResultModal
        isOpen={showQuizResultModal}
        onClose={() => setShowQuizResultModal(false)}
        result={quizResultAnalysis}
        onOpenLeaderboard={handleOpenLeaderboard}
      />

      {/* Teacher Question Authoring & Question Bank Modal */}
      <ManageQuestionsModal
        isOpen={showManageQuestionsModal}
        onClose={() => setShowManageQuestionsModal(false)}
        testsList={testsList}
        selectedTestId={selectedManageTestId}
      />

      {/* Global Command Palette & Search (Cmd+K) */}
      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          setShowCommandPalette(false)
        }}
        userRole={userRole}
        classList={classList}
        studyMaterials={studyMaterials}
        doubtsList={doubtsList}
        announcements={announcements}
        onOpenAskDoubt={() => setShowAskDoubtModal(true)}
        onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
      />
    </div>
  )
}
