import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthCard from '../../components/layout/AuthCard'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { merchantService } from '../../services/merchantService'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage } from '../../utils/formatters'

export default function FirstLoginChangePassword() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      await merchantService.firstLoginChangePassword({
        tempPassword: values.tempPassword,
        newPassword: values.newPassword,
      })
      toast.success('Password changed. Please log in again with your new password.')
      await logout()
      navigate('/login')
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not change password'))
    }
  }

  return (
    <AuthCard title="Set a new password" subtitle="You must change your temporary password before continuing">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Temporary password"
          type="password"
          error={errors.tempPassword?.message}
          {...register('tempPassword', { required: 'Required' })}
        />
        <Input
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'Required',
            minLength: { value: 8, message: 'At least 8 characters' },
            pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: 'Needs upper, lower, digit' },
          })}
        />
        <Input
          label="Confirm new password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Required',
            validate: (v) => v === watch('newPassword') || 'Passwords do not match',
          })}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Set password &amp; continue
        </Button>
      </form>
    </AuthCard>
  )
}
