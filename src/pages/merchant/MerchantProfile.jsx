import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { merchantService } from '../../services/merchantService'
import { Input } from '../../components/ui/FormFields'
import Button from '../../components/ui/Button'
import { Card, Spinner } from '../../components/ui/Primitives'
import { extractErrorMessage } from '../../utils/formatters'

export default function MerchantProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    merchantService.getProfile().then((res) => setProfile(res.data.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="space-y-8 max-w-lg">
      <ProfileForm profile={profile} onUpdated={setProfile} />
      <PasswordForm />
    </div>
  )
}

function ProfileForm({ profile, onUpdated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      businessName: profile?.businessName,
      gstNumber: profile?.gstNumber,
      contactPhone: profile?.contactPhone,
    },
  })

  async function onSubmit(values) {
    try {
      const { data } = await merchantService.updateProfile(values)
      onUpdated(data.data)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg text-navy mb-4">Business details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" value={profile?.email} disabled className="opacity-60" />
        <Input label="Business name" error={errors.businessName?.message} {...register('businessName', { required: 'Required' })} />
        <Input label="GST number" {...register('gstNumber')} />
        <Input label="Contact phone" error={errors.contactPhone?.message} {...register('contactPhone', { required: 'Required' })} />
        <Button type="submit" loading={isSubmitting}>Save changes</Button>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    try {
      await merchantService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      toast.success('Password changed')
      reset()
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not change password'))
    }
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg text-navy mb-4">Change password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Current password" type="password" error={errors.currentPassword?.message} {...register('currentPassword', { required: 'Required' })} />
        <Input
          label="New password"
          type="password"
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
        <Button type="submit" loading={isSubmitting} variant="outline">Update password</Button>
      </form>
    </Card>
  )
}
