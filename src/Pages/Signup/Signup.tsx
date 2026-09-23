import { useState } from 'react'
import { Logo } from '../../assets'
import { Eye, EyeOff, Lock, Mail, Phone, User, MapPin, GraduationCap, Users, UserCheck, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../utils/routesEnums'
import { signupApi } from '../../apiRequest/authRequest'
import { toast } from 'react-toastify'

type RoleType = 'student' | 'parent' | 'teacher'

export const Signup = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState<RoleType>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Student specific form state
  const [studentData, setStudentData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    parentInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
    }
  })

  // Parent & Teacher form state
  const [generalData, setGeneralData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    password: '',
    phoneNumber: ''
  })

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('parent_')) {
      const parentField = name.replace('parent_', '')
      setStudentData((prev) => ({
        ...prev,
        parentInfo: {
          ...prev.parentInfo,
          [parentField]: value
        }
      }))
    } else {
      setStudentData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGeneralData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    let payload
    if (role === 'student') {
      payload = {
        email: studentData.email,
        password: studentData.password,
        role: 'student',
        phoneNumber: studentData.phoneNumber,
        parentInfo: {
          firstName: studentData.parentInfo.firstName,
          lastName: studentData.parentInfo.lastName,
          email: studentData.parentInfo.email,
          phoneNumber: studentData.parentInfo.phoneNumber
        }
      }
    } else {
      payload = {
        firstName: generalData.firstName,
        lastName: generalData.lastName,
        address: generalData.address,
        email: generalData.email,
        role: role,
        password: generalData.password,
        phoneNumber: generalData.phoneNumber
      }
    }

    try {
      const response: any = await signupApi(payload)

      if (response && (response.token || response.data?.token || response.data?.userDetails || response.success || response.status === 200 || response.status === true || response.message?.toLowerCase().includes('success'))) {
        const token = response.token || response.data?.token || response.accessToken
        const user = response.data?.userDetails || response.userDetails || response.user || response.data?.user

        if (token) localStorage.setItem('agility_token', token)
        if (user) {
          const userWithRole = { ...user, role: user.role || role }
          localStorage.setItem('agility_user', JSON.stringify(userWithRole))
        }

        toast.success(response.message || 'Account created successfully!')
        navigate(ROUTES.home)
      } else if (response) {
        toast.error(response.message || 'Registration failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Signup Error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong during signup. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#1d4ed8] via-[#1e40af] to-[#1e3a8a] pt-10 pb-8 px-6 text-center text-white flex flex-col items-center justify-center">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-3 border border-white/20">
          <img src={Logo} alt="EduFlow Logo" className="w-8 h-8 object-contain" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">EduFlow</h1>
        <p className="text-blue-100/90 text-sm font-medium mt-1">Smart Coaching Management</p>
      </div>

      {/* Form Area */}
      <div className="flex-1 bg-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'parent'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Users className="w-4 h-4" />
                Parent
              </button>

              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Teacher
              </button>
            </div>
          </div>

          {/* Student Fields */}
          {role === 'student' && (
            <>
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Student Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={studentData.email}
                    onChange={handleStudentChange}
                    placeholder="vishal@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={studentData.password}
                    onChange={handleStudentChange}
                    placeholder="Avi@1234"
                    className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Student Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={studentData.phoneNumber}
                    onChange={handleStudentChange}
                    placeholder="+919555593907"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Parent Info Section */}
              <div className="pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    Parent / Guardian Information
                  </h3>

                  {/* Parent First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="parent_firstName"
                        value={studentData.parentInfo.firstName}
                        onChange={handleStudentChange}
                        placeholder="Rajkumar"
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="parent_lastName"
                        value={studentData.parentInfo.lastName}
                        onChange={handleStudentChange}
                        placeholder="Mishra"
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Parent Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parent Email
                    </label>
                    <input
                      type="email"
                      name="parent_email"
                      value={studentData.parentInfo.email}
                      onChange={handleStudentChange}
                      placeholder="raj@gmail.com"
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                      required
                    />
                  </div>

                  {/* Parent Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parent Phone Number
                    </label>
                    <input
                      type="tel"
                      name="parent_phoneNumber"
                      value={studentData.parentInfo.phoneNumber}
                      onChange={handleStudentChange}
                      placeholder="9882828888"
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Parent & Teacher Fields */}
          {(role === 'parent' || role === 'teacher') && (
            <>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    First Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="firstName"
                      value={generalData.firstName}
                      onChange={handleGeneralChange}
                      placeholder="Avinash"
                      className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Last Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="lastName"
                      value={generalData.lastName}
                      onChange={handleGeneralChange}
                      placeholder="Mishra"
                      className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={generalData.email}
                    onChange={handleGeneralChange}
                    placeholder="raj@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={generalData.password}
                    onChange={handleGeneralChange}
                    placeholder="Avi@1234"
                    className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={generalData.phoneNumber}
                    onChange={handleGeneralChange}
                    placeholder="9536363668"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Address
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="address"
                    value={generalData.address}
                    onChange={handleGeneralChange}
                    placeholder="airport road victoria lane 3"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer mt-4 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              `Create Account (${role.charAt(0).toUpperCase() + role.slice(1)})`
            )}
          </button>
        </form>

        {/* Footer Area */}
        <div className="mt-6 pt-4 text-center space-y-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to={ROUTES.home}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
