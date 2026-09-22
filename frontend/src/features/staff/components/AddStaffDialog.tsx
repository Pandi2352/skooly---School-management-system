import { useState, type SyntheticEvent } from 'react'
import { DEPARTMENTS, EMPLOYMENT_TYPES } from '../constants'
import type { Department, EmploymentType } from '../constants'
import { useCreateStaff } from '../hooks/useStaff'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type AddStaffDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStaffDialog({ open, onOpenChange }: AddStaffDialogProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [gender, setGender] = useState('female')
  const [department, setDepartment] = useState<Department>('Secondary')
  const [designation, setDesignation] = useState('')
  const [employmentType, setEmploymentType] = useState<EmploymentType>('permanent')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [dateOfJoining, setDateOfJoining] = useState(
    new Date().toISOString().split('T')[0] ?? '2026-09-01',
  )
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateStaff()

  const handleSubmit = async () => {
    setError(null)

    if (!firstName.trim() || !lastName.trim() || !designation.trim() || !phone.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      await createMutation.mutateAsync({
        photoUrl: null,
        personalInfo: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
        },
        contactInfo: {
          phone: phone.trim(),
          email: email.trim() || undefined,
        },
        employment: {
          employeeId: employeeId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          designation: designation.trim(),
          department,
          dateOfJoining,
          employmentType,
          status: 'active',
        },
        qualifications: [],
        experience: [],
        leaveBalance: {
          casual: 12,
          medical: 10,
          earned: 15,
          maternity: 90,
          paternity: 10,
        },
        subjects: [],
        classes: [],
      })
      onOpenChange(false)
      // Reset form
      setFirstName('')
      setLastName('')
      setEmployeeId('')
      setDesignation('')
      setPhone('')
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create staff member.')
    }
  }

  const deptOptions = DEPARTMENTS.map((d) => ({ value: d, label: d }))
  const typeOptions = EMPLOYMENT_TYPES.map((t) => ({
    value: t,
    label: t.charAt(0).toUpperCase() + t.slice(1),
  }))
  const genderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Staff Member"
      description="Enter basic staff details to create their profile. Additional information can be added later."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              void handleSubmit()
            }}
            loading={createMutation.isPending}
          >
            Create Staff Member
          </Button>
        </div>
      }
    >
      <form
        onSubmit={(e: SyntheticEvent) => {
          e.preventDefault()
          void handleSubmit()
        }}
        className="grid gap-4 py-2"
      >
        {error && (
          <div className="rounded-sm bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g. Ramesh"
          />
          <Input
            label="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g. Kumar"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            label="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Auto-generated if empty"
            hint="Format: EMP-0001"
          />
          <Select
            label="Gender"
            value={gender}
            options={genderOptions}
            onValueChange={setGender}
          />
          <Select
            label="Department"
            value={department}
            options={deptOptions}
            onValueChange={(val) => setDepartment(val as Department)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Designation / Role"
            required
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g. Senior Science Teacher"
          />
          <Select
            label="Employment Type"
            value={employmentType}
            options={typeOptions}
            onValueChange={(val) => setEmploymentType(val as EmploymentType)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            label="Phone Number"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@school.edu"
          />
          <Input
            label="Date of Joining"
            type="date"
            required
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
          />
        </div>
      </form>
    </Dialog>
  )
}
