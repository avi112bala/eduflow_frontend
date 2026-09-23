import { useLocation } from "react-router-dom"
import { ROUTES } from "../../utils/routesEnums"
import { Login } from "../Login/Login"
import { Signup } from "../Signup/Signup"
import { ForgotPassword } from "../ForgotPassword/ForgotPassword"

export const AuthLayout = () => {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-3 sm:p-6 selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md sm:max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl shadow-blue-950/40 overflow-hidden flex flex-col justify-between border border-white/20 transition-all duration-300">
        {(pathname === ROUTES.home || pathname === ROUTES.login) && <Login />}
        {pathname === ROUTES.signup && <Signup />}
        {pathname === ROUTES.forgot_password && <ForgotPassword />}
      </div>
    </div>
  )
}
