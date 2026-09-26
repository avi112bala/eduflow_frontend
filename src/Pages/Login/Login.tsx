import { useState } from "react"
import { Logo } from "../../assets"
import { Eye, EyeOff, Lock, Mail, Loader2, UserCheck } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { loginApi } from "../../apiRequest/authRequest"
import { toast } from "react-toastify"
import { ROUTES } from "../../utils/routesEnums"

type RoleType = 'student' | 'parent' | 'teacher'

export const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState<RoleType>('parent')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const payload = {
            email: formData.email,
            password: formData.password,
            role: role
        }

        try {
            const response: any = await loginApi(payload)
            
            if (response && (response.token || response.data?.token || response.data?.userDetails || response.success || response.status === 200 || response.status === true || response.message?.toLowerCase().includes('success'))) {
                const token = response.token || response.data?.token || response.accessToken
                const user = response.data?.userDetails || response.userDetails || response.user || response.data?.user

                if (token) localStorage.setItem('agility_token', token)
                if (user) {
                    const userWithRole = { ...user, role: user.role || role }
                    localStorage.setItem('agility_user', JSON.stringify(userWithRole))
                }

                toast.success(response.message || 'Signed in successfully!')
                navigate(ROUTES.dashboard)
            } else if (response) {
                toast.error(response.message || 'Sign in failed. Please check your credentials.')
            }
        } catch (error: any) {
            console.error('Signin Error:', error)
            const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="bg-gradient-to-b from-[#1d4ed8] via-[#1e40af] to-[#1e3a8a] pt-12 pb-10 px-6 text-center text-white flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 border border-white/20">
                    <img src={Logo} alt="EduFlow Logo" className="w-8 h-8 object-contain" />
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white">EduFlow</h1>
                <p className="text-blue-100/90 text-sm font-medium mt-1">Smart Coaching Management</p>
            </div>

            <div className="flex-1 bg-white p-6 sm:p-8 flex flex-col justify-between">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-blue-600" />
                            Select Role
                        </label>
                        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
                            {(['parent', 'student', 'teacher'] as const).map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                                        role === r
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your Password"
                                className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <Link
                            to={ROUTES.forgot_password}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer mt-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer Area */}
                <div className="mt-8 pt-4 text-center space-y-3">
                    <p className="text-xs text-slate-400">
                        By signing in, you agree to our{' '}
                        <a href="#terms" className="text-slate-600 hover:underline font-medium">
                            Terms & Privacy Policy
                        </a>
                    </p>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors">
                            Sign Up
                        </a>
                    </p>
                    <button
                        type="button"
                        className="text-xs font-semibold text-slate-600 hover:text-slate-800 hover:underline transition-colors cursor-pointer block w-full"
                    >
                        Offline Institute Login
                    </button>
                </div>
            </div>
        </>
    )
}


