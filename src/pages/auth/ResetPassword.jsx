import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthCard from '../../components/layout/AuthCard'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'
import { extractErrorMessage } from '../../utils/formatters'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: location.state?.email || '' } })

  async function onSubmit(values) {
    try {
      await authService.resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      })
      toast.success('Password reset. Please log in again.')
      navigate('/login')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not reset password'))
    }
  }

  return (
    <AuthCard title="Reset password" subtitle="Enter the code you received and a new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Reset code"
          placeholder="000000"
          error={errors.otp?.message}
          {...register('otp', { required: 'Code is required' })}
        />
        <Input
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message: 'Needs an uppercase, lowercase letter, and a digit',
            },
          })}
        />
        <Input
          label="Confirm new password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('newPassword') || 'Passwords do not match',
          })}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Reset password
        </Button>
      </form>
    </AuthCard>
  )
}
