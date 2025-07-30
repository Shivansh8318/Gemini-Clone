import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { ChevronDown, Phone, Shield, Moon, Sun } from 'lucide-react'
import { useStore } from '../store/useStore'

const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Please select a country'),
  phone: z.string().min(5, 'Phone number must be at least 5 digits'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
})

type PhoneForm = z.infer<typeof phoneSchema>
type OtpForm = z.infer<typeof otpSchema>

export default function Auth() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [showCountries, setShowCountries] = useState(false)
  const [phoneData, setPhoneData] = useState<PhoneForm | null>(null)
  const [otpCountdown, setOtpCountdown] = useState(0)
  
  const { countries, setCountries, setUser, isDarkMode, toggleDarkMode } = useStore()

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '',
      phone: '',
    },
  })

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  })

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag')
        const data = await response.json()
        
        const formattedCountries = data
          .filter((country: any) => country.idd?.root)
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
            dialCode: country.idd.root + (country.idd.suffixes?.[0] || ''),
            flag: country.flag,
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name))

        setCountries(formattedCountries)
      } catch (error) {
        toast.error('Failed to load countries')
        console.error('Error fetching countries:', error)
      }
    }

    if (countries.length === 0) {
      fetchCountries()
    }
  }, [countries, setCountries])

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpCountdown])

  const onPhoneSubmit = (data: PhoneForm) => {
    setPhoneData(data)
    setStep('otp')
    setOtpCountdown(30)
    
    // Simulate OTP send
    setTimeout(() => {
      toast.success('OTP sent successfully!')
    }, 1000)
  }

  const onOtpSubmit = (data: OtpForm) => {
    // Simulate OTP verification
    setTimeout(() => {
      if (data.otp === '123456') {
        const user = {
          id: Math.random().toString(36),
          phone: phoneData!.phone,
          countryCode: phoneData!.countryCode,
          isAuthenticated: true,
        }
        setUser(user)
        toast.success('Welcome to Gemini Chat!')
      } else {
        toast.error('Invalid OTP. Try 123456 for demo.')
      }
    }, 1500)
  }

  const resendOtp = () => {
    if (otpCountdown === 0) {
      setOtpCountdown(30)
      setTimeout(() => {
        toast.success('OTP resent successfully!')
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {step === 'phone' ? 'Welcome to Gemini' : 'Verify Your Number'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {step === 'phone' 
                ? 'Enter your phone number to get started' 
                : 'Enter the 6-digit code sent to your phone'
              }
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
              {/* Country Selector */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <button
                  type="button"
                  onClick={() => setShowCountries(!showCountries)}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <span className="flex items-center">
                    {selectedCountry ? (
                      <>
                        <span className="mr-2">{selectedCountry.flag}</span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedCountry.name} ({selectedCountry.dialCode})
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Select country</span>
                    )}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {showCountries && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {countries.map((country: any) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country)
                          phoneForm.setValue('countryCode', country.dialCode)
                          setShowCountries(false)
                        }}
                        className="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-600 text-left"
                      >
                        <span className="mr-3">{country.flag}</span>
                        <span className="flex-1 text-gray-900 dark:text-white">
                          {country.name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {country.dialCode}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {phoneForm.formState.errors.countryCode && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {phoneForm.formState.errors.countryCode.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...phoneForm.register('phone')}
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={phoneForm.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {phoneForm.formState.isSubmitting ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  {...otpForm.register('otp')}
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {otpForm.formState.errors.otp && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={otpForm.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {otpForm.formState.isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={otpCountdown > 0}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {otpCountdown > 0 ? `Resend OTP in ${otpCountdown}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  otpForm.reset()
                }}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ← Back to phone number
              </button>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Demo Tip:</strong> Use OTP <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">123456</code> to continue
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}