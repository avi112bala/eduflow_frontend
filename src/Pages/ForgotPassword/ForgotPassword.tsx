import { useState } from 'react'
import { Logo } from '../../assets'
import { Eye, EyeOff, Lock, Mail, Loader2, KeyRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../utils/routesEnums'
import { forgotPasswordApi } from '../../apiRequest/authRequest'
import { toast } from 'react-toastify'

export const ForgotPassword = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: 'avi@gmail.com',
        newpassword: 'Avi@1234'
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
            newpassword: formData.newpassword
        }

        try {
            const response: any = await forgotPasswordApi(payload)

            const isSuccess =
                response &&
                (response._id ||
                 response.email ||
                 response.data?._id ||
                 response.data?.email ||
                 response.success ||
                 response.status === 200 ||
                 response.status === true)

            if (isSuccess) {
                toast.success(response?.message || 'Password reset successfully! Please sign in with your new password.')
                navigate(ROUTES.login)
            } else if (response) {
                toast.error(response.message || 'Failed to reset password. Please check your credentials.')
            }
        } catch (error: any) {
            console.error('ForgotPassword Error:', error)
            const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Header Banner */}
            <div className="bg-gradient-to-b from-[#1d4ed8] via-[#1e40af] to-[#1e3a8a] pt-12 pb-10 px-6 text-center text-white flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 border border-white/20">
                    <img src={Logo} alt="EduFlow Logo" className="w-8 h-8 object-contain" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">EduFlow</h1>
                <p className="text-blue-100/90 text-sm font-medium mt-1">Smart Coaching Management</p>
            </div>

            {/* Form Section */}
            <div className="flex-1 bg-white p-6 sm:p-8 flex flex-col justify-between">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="text-center mb-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                            <KeyRound className="w-5 h-5 text-blue-600" />
                            Reset Password
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Enter your account email and new password to update credentials.
                        </p>
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
                                placeholder="avi@gmail.com"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* New Password Field */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                            New Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="newpassword"
                                value={formData.newpassword}
                                onChange={handleChange}
                                placeholder="Avi@1234"
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer mt-4 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>

                {/* Footer Area */}
                <div className="mt-8 pt-4 text-center space-y-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                        Remember your password?{' '}
                        <Link
                            to={ROUTES.login}
                            className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
                        >
                            Back to Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
