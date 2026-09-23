import React from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon
} from 'lucide-react'

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  profilPic: string
  address: string
  phoneNumber: string
}

interface EditProfileModalProps {
  show: boolean
  profileForm: ProfileFormData
  setProfileForm: React.Dispatch<React.SetStateAction<ProfileFormData>>
  isUpdating: boolean
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7UvRFDtLOE-f7C6l_RIIloM4HUZz5bf4iDlifbSqkw&s=10'
]

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  profileForm,
  setProfileForm,
  isUpdating,
  onSubmit,
  onClose
}) => {
  if (!show) return null

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePresetSelect = (url: string) => {
    setProfileForm((prev) => ({ ...prev, profilPic: url }))
  }

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 ring-1 ring-slate-200">
        {/* Dark Premium Gradient Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <User className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Edit Profile
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  Account
                </span>
              </h3>
              <p className="text-xs text-blue-100/80 font-medium">
                Update personal information and contact details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-sm cursor-pointer flex items-center justify-center transition-colors border border-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Profile Picture Header & Presets */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-500/30 shadow-md bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl">
                {profileForm.profilPic ? (
                  <img
                    src={profileForm.profilPic}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <span>{profileForm.firstName?.charAt(0) || 'U'}</span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <div>
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-center sm:justify-start gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  name="profilPic"
                  value={profileForm.profilPic || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Preset Avatars */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Or Select Preset:
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${
                        profileForm.profilPic === preset
                          ? 'border-blue-600 ring-2 ring-blue-500/30'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset}
                        alt="Preset avatar"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                First Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  name="firstName"
                  value={profileForm.firstName || ''}
                  onChange={handleInputChange}
                  placeholder="Avinash"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Last Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  name="lastName"
                  value={profileForm.lastName || ''}
                  onChange={handleInputChange}
                  placeholder="Mishra"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                name="email"
                value={profileForm.email || ''}
                onChange={handleInputChange}
                placeholder="raj@gmail.com"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="tel"
                name="phoneNumber"
                value={profileForm.phoneNumber || ''}
                onChange={handleInputChange}
                placeholder="9536363668"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          {/* Residential Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Residential Address
            </label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                name="address"
                value={profileForm.address || ''}
                onChange={handleInputChange}
                placeholder="airport road victoria lane 3"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-70 transition-all flex items-center justify-center gap-1.5"
            >
              {isUpdating ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
