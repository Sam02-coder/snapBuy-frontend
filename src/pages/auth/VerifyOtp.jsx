import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import AuthCard from '../../components/layout/AuthCard'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'
import { extractErrorMessage } from '../../utils/formatters'

export default function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email] = useState(location.state?.email || '')
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      await authService.verifyOtp({ email, otp: values.otp })
      toast.success('Email verified. You can now log in.')
      navigate('/login')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Invalid or expired OTP'))
    }
  }

  async function handleResend() {
    setResending(true)
    try {
      await authService.resendOtp({ email })
      toast.success('A new OTP has been sent.')
      setCooldown(60)
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer)
            return 0
          }
          return c - 1
        })
      }, 1000)
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not resend OTP'))
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthCard title="Verify your email" subtitle={email ? `Enter the code sent to ${email}` : 'Enter your verification code'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="OTP Code"
          placeholder="000000"
          maxLength={6}
          className="tracking-[0.5em] text-center font-mono text-lg"
          error={errors.otp?.message}
          {...register('otp', { required: 'OTP is required' })}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Verify
        </Button>
      </form>
      <button
        onClick={handleResend}
        disabled={resending || cooldown > 0}
        className="w-full text-center text-sm text-navy font-medium mt-4 hover:underline disabled:opacity-50 disabled:no-underline"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
      </button>
    </AuthCard>
  )
}
