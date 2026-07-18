import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthCard from '../../components/layout/AuthCard'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage } from '../../utils/formatters'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      const user = await login(values)

      if (user.role === 'MERCHANT' && user.firstLogin) {
        navigate('/merchant/change-password')
        return
      }

      const redirectTo =
        location.state?.from?.pathname ||
        { ADMIN: '/admin', MERCHANT: '/merchant', CUSTOMER: '/' }[user.role] ||
        '/'
      navigate(redirectTo)
      toast.success('Welcome back!')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Invalid email or password'))
    }
  }

  return (
    <AuthCard title="Log in" subtitle="Welcome back to ShopSphere">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-navy font-medium hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Log in
        </Button>
      </form>
      <p className="text-sm text-ink-soft text-center mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-navy font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </AuthCard>
  )
}
