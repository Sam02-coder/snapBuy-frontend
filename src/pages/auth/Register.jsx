import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthCard from '../../components/layout/AuthCard'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'
import { extractErrorMessage } from '../../utils/formatters'

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      await authService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      })
      toast.success('Account created. Check your email for the OTP.')
      navigate('/verify-otp', { state: { email: values.email } })
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Registration failed'))
    }
  }

  return (
    <AuthCard title="Create your account" subtitle="Start shopping on ShopSphere">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Full name is required' })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Phone"
          placeholder="9999999999"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone number is required' })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message: 'Needs an uppercase, lowercase letter, and a digit',
            },
          })}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          })}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
      <p className="text-sm text-ink-soft text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-navy font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  )
}
