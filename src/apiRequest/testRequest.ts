import { apiService } from '../api/apiServices'
import type { ITestItem, ITestResult, ILeaderboardEntry, IQuizQuestion } from '../types/dashboard'

export interface ISubmitTestMarksPayload {
  testId: string
  marksData: Array<{
    studentId: string
    marksObtained: number
    remarks?: string
  }>
}

/**
 * Fetch all published tests from backend
 */
export const getTestsApi = async (): Promise<{ data: ITestItem[] }> => {
  try {
    const response = await apiService.get('/get-tests')
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn('Backend /get-tests error:', err)
  }

  return { data: [] }
}

/**
 * Fetch test results & scores for a specific student from backend
 */
export const getStudentTestResultsApi = async (studentId: string): Promise<{ data: ITestResult[] }> => {
  try {
    const response = await apiService.get(`/student-test-results/${studentId}`)
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn(`Backend /student-test-results/${studentId} error:`, err)
  }

  return { data: [] }
}

/**
 * Fetch leaderboard ranking for a given test from backend
 */
export const getTestLeaderboardApi = async (testId: string): Promise<{ data: ILeaderboardEntry[] }> => {
  try {
    const response = await apiService.get(`/test-leaderboard/${testId}`)
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn(`Backend /test-leaderboard/${testId} error:`, err)
  }

  return { data: [] }
}

/**
 * Upload student marks in bulk (Teacher action)
 */
export const submitTestMarksApi = async (payload: ISubmitTestMarksPayload) => {
  const response = await apiService.post({
    url: '/test-marks/bulk-upload',
    payload
  })
  return response
}

/**
 * Fetch questions for a specific quiz test from backend
 */
export const getQuizQuestionsApi = async (testId: string): Promise<{ data: IQuizQuestion[] }> => {
  try {
    const response = await apiService.get(`/tests/${testId}/questions`)
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn(`Backend /tests/${testId}/questions error:`, err)
  }

  return { data: [] }
}

/**
 * Add a new MCQ question to a test (Teacher action)
 */
export const addQuestionToTestApi = async (payload: {
  testId: string
  question: string
  options: string[]
  correctOptionIndex: number
  subject: string
  topic: string
  points: number
  negativePoints?: number
  explanation?: string
}) => {
  return await apiService.post({
    url: `/tests/${payload.testId}/questions`,
    payload
  })
}

/**
 * Delete a question from a test
 */
export const deleteQuestionApi = async (testId: string, questionId: string) => {
  return await apiService.delete({
    url: `/tests/${testId}/questions/${questionId}`
  })
}

/**
 * Evaluate submitted quiz answers
 */
export const evaluateQuiz = (
  testItem: { _id?: string; testName: string; subjectName?: string; testDuration?: string },
  questions: IQuizQuestion[],
  answers: Record<string, number>,
  timeSpentSeconds: number
) => {
  let marksObtained = 0
  let totalMarks = 0
  let correctCount = 0
  let incorrectCount = 0
  let unattempted = 0

  const topicMap: Record<string, { total: number; correct: number; subject: string }> = {}

  const questionReview = questions.map((q) => {
    totalMarks += q.points
    const selected = answers[q.id]
    const isAttempted = selected !== undefined && selected !== null && selected >= 0
    const isCorrect = isAttempted && selected === q.correctOptionIndex

    if (!topicMap[q.topic]) {
      topicMap[q.topic] = { total: 0, correct: 0, subject: q.subject }
    }
    topicMap[q.topic].total += 1

    if (!isAttempted) {
      unattempted += 1
    } else if (isCorrect) {
      correctCount += 1
      marksObtained += q.points
      topicMap[q.topic].correct += 1
    } else {
      incorrectCount += 1
      marksObtained -= (q.negativePoints || 0)
    }

    return {
      question: q,
      selectedOptionIndex: isAttempted ? selected : undefined,
      isCorrect
    }
  })

  const attemptedCount = correctCount + incorrectCount
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0

  const topicBreakdown = Object.entries(topicMap).map(([topic, stat]) => {
    const topicAccuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    return {
      topic,
      subject: stat.subject,
      totalQuestions: stat.total,
      correctCount: stat.correct,
      accuracy: topicAccuracy,
      isWeak: topicAccuracy < 50
    }
  })

  return {
    testId: testItem._id || 'quiz',
    testName: testItem.testName,
    subject: testItem.subjectName || 'General Science',
    totalMarks,
    marksObtained: Math.max(0, marksObtained),
    accuracy,
    timeSpentSeconds,
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    unattempted,
    topicBreakdown,
    questionReview
  }
}

/**
 * Submit student quiz attempt to backend
 */
export const submitQuizAttemptApi = async (payload: {
  testId: string
  studentId: string
  studentName?: string
  answers: Record<string, number>
  timeSpentSeconds: number
  marksObtained: number
  totalMarks: number
  accuracy: number
}) => {
  return await apiService.post({
    url: `/tests/${payload.testId}/submit`,
    payload
  })
}

/**
 * Save student test scorecard to backend
 */
export const saveStudentTestScoreApi = async (payload: {
  studentId: string
  testId: string
  testName: string
  subject: string
  marksObtained: number
  totalMarks: number
  accuracy: number
  percentile: number
  rank?: number
  remarks?: string
}) => {
  return await apiService.post({
    url: '/submit-test-result',
    payload
  })
}

/**
 * Fetch batch scoreboard for a test from backend
 */
export const getBatchScoreboardApi = async (testId: string): Promise<{
  data: Array<{
    studentId: string
    studentName: string
    marksObtained: number
    totalMarks: number
    accuracy: number
    rank: number
    submittedAt: string
  }>
}> => {
  try {
    const response = await apiService.get(`/test-scoreboard/${testId}`)
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn(`Backend /test-scoreboard/${testId} error:`, err)
  }

  return { data: [] }
}
