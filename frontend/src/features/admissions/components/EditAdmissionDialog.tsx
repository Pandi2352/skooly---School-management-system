import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/lib/api/ApiError'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { GRADE_FILTER_OPTIONS } from '../constants/admissionFilters'
import { useUpdateAdmissionDetails } from '../hooks/useAdmissionPipeline'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'

const editAdmissionSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter the applicant’s first name').max(60, 'Use 60 characters or fewer'),
  lastName: z.string().trim().min(1, 'Enter the applicant’s last name').max(60, 'Use 60 characters or fewer'),
  gradeApplied: z.string().min(1, 'Choose the grade applied for'),
  previousSchool: z.string().trim().max(120, 'Use 120 characters or fewer'),
  parentName: z.string().trim().min(1, 'Enter the parent or guardian’s name').max(80, 'Use 80 characters or fewer'),
  parentPhone: z
    .string()
    .trim()
    .refine((value) => /^\+?[\d][\d\s-]{5,}$/.test(value), 'Enter a phone number with at least 6 digits'),
  parentEmail: z.string().trim().pipe(z.email('Enter a valid email address')),
})

type EditAdmissionValues = z.infer<typeof editAdmissionSchema>

type EditAdmissionDialogProps = {
  /** Null closes the dialog; an application opens it. */
  application: AdmissionApplication | null
  onClose: () => void
}

/**
 * Corrections only: a misheard surname, the wrong grade, a new phone number. Status, documents and
 * enrolment each have their own action, so fixing a spelling can't approve anyone by accident.
 */
export function EditAdmissionDialog({ application, onClose }: EditAdmissionDialogProps) {
  const updateDetails = useUpdateAdmissionDetails()
  const { toast } = useToast()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EditAdmissionValues>({
    resolver: zodResolver(editAdmissionSchema),
    // Remounted per application by the `key` below, so the defaults are the row being edited.
    defaultValues: {
      firstName: application?.student.firstName ?? '',
      lastName: application?.student.lastName ?? '',
      gradeApplied: application ? String(application.student.gradeApplied) : '',
      previousSchool: application?.student.previousSchool ?? '',
      parentName: application?.parent.name ?? '',
      parentPhone: application?.parent.phone ?? '',
      parentEmail: application?.parent.email ?? '',
    },
  })

  const submit = handleSubmit(async (values) => {
    if (!application) return
    try {
      await updateDetails.mutateAsync({
        id: application._id,
        input: {
          firstName: values.firstName,
          lastName: values.lastName,
          gradeApplied: Number(values.gradeApplied),
          previousSchool: values.previousSchool,
          parentName: values.parentName,
          parentPhone: values.parentPhone,
          parentEmail: values.parentEmail,
        },
      })
      toast.success('Application updated', `${application.applicationNo} has been corrected.`)
      onClose()
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === 'ADMISSION_NO_CHANGES') {
        toast.info('Nothing changed', 'Edit a detail before saving.')
        return
      }
      setError('firstName', { message: getErrorMessage(error) }, { shouldFocus: true })
    }
  })

  if (!application) return null

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={`Edit ${application.applicationNo}`}
      description="Correct the applicant's details. Status and enrolment are handled from the review panel."
    >
      <form onSubmit={(event) => void submit(event)} className="grid gap-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" required error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last name" required error={errors.lastName?.message} {...register('lastName')} />
        </div>

        <Controller
          control={control}
          name="gradeApplied"
          render={({ field }) => (
            <Select
              label="Grade applied for"
              required
              value={field.value}
              onValueChange={field.onChange}
              error={errors.gradeApplied?.message}
              // The filter's "all grades" entry isn't a grade anyone can apply to.
              options={GRADE_FILTER_OPTIONS.filter((option) => option.value !== 'all')}
            />
          )}
        />

        <Input
          label="Previous school"
          placeholder="e.g. St. Xavier Kindergarten"
          error={errors.previousSchool?.message}
          {...register('previousSchool')}
        />

        <Input label="Parent or guardian" required error={errors.parentName?.message} {...register('parentName')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Phone"
            required
            placeholder="+91 98765 43210"
            error={errors.parentPhone?.message}
            {...register('parentPhone')}
          />
          <Input
            label="Email"
            type="email"
            required
            error={errors.parentEmail?.message}
            {...register('parentEmail')}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save changes
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
