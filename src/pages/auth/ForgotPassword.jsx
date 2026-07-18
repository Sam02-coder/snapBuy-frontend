import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthCard from '../../components/layout/AuthCard'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'
import { extractErrorMessage } from '../../utils/formatters'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      await authService.forgotPassword({ email: values.email })
      toast.success('If an account exists, a reset code has been sent.')
      navigate('/reset-password', { state: { email: values.email } })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <AuthCard title="Forgot password" subtitle="We'll send a reset code to your email">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Send reset code
        </Button>
      </form>
    </AuthCard>
  )
}
