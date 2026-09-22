import { ArrowLeftIcon, CheckIcon } from '@phosphor-icons/react'
import { useState, type SyntheticEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { DEPARTMENTS, EMPLOYMENT_STATUSES, EMPLOYMENT_TYPES } from '../constants'
import type { Department, EmploymentStatus, EmploymentType } from '../constants'
import { useCreateStaff, useStaffMember, useUpdateStaff } from '../hooks/useStaff'
import type { StaffDetail } from '../types/staff.types'
import { STATUS_LABEL, typeLabel } from '../utils/staffStatus'

export function StaffEditPage() {
  const { staffId } = useParams<{ staffId: string }>()
  const isNew = !staffId || staffId === 'new'
  const staffQuery = useStaffMember(isNew ? '' : staffId)

  if (!isNew && staffQuery.isLoading) {
    return (
      <PageContainer title="Staff Profile">
        <LoadingState label="staff records" />
      </PageContainer>
    )
  }

  return <StaffEditForm staffId={staffId} staff={staffQuery.data} isNew={isNew} />
}

type StaffEditFormProps = {
  staffId?: string
  staff?: StaffDetail
  isNew: boolean
}

function StaffEditForm({ staffId, staff, isNew }: StaffEditFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff()

  // Form State initialized directly from props
  const [firstName, setFirstName] = useState(staff?.personalInfo.firstName ?? '')
  const [lastName, setLastName] = useState(staff?.personalInfo.lastName ?? '')
  const [gender, setGender] = useState(staff?.personalInfo.gender ?? 'female')
  const [dateOfBirth, setDateOfBirth] = useState(staff?.personalInfo.dateOfBirth ?? '')
  const [bloodGroup, setBloodGroup] = useState(staff?.personalInfo.bloodGroup ?? '')
  const [aadhaarNumber, setAadhaarNumber] = useState(staff?.personalInfo.aadhaarNumber ?? '')
  const [panNumber, setPanNumber] = useState(staff?.personalInfo.panNumber ?? '')

  const [phone, setPhone] = useState(staff?.contactInfo.phone ?? '')
  const [altPhone, setAltPhone] = useState(staff?.contactInfo.altPhone ?? '')
  const [email, setEmail] = useState(staff?.contactInfo.email ?? '')
  const [address, setAddress] = useState(staff?.contactInfo.address ?? '')

  const [employeeId, setEmployeeId] = useState(staff?.employment.employeeId ?? '')
  const [designation, setDesignation] = useState(staff?.employment.designation ?? '')
  const [department, setDepartment] = useState<Department>(
    staff?.employment.department ?? 'Secondary',
  )
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    staff?.employment.employmentType ?? 'permanent',
  )
  const [status, setStatus] = useState<EmploymentStatus>(staff?.employment.status ?? 'active')
  const [dateOfJoining, setDateOfJoining] = useState(
    staff?.employment.dateOfJoining ?? '2026-09-01',
  )
  const [salaryRupees, setSalaryRupees] = useState(
    staff?.employment.salaryPaise ? String(Math.round(staff.employment.salaryPaise / 100)) : '',
  )
  const [reportingTo, setReportingTo] = useState(staff?.employment.reportingTo ?? '')

  const [subjectsStr, setSubjectsStr] = useState(staff?.subjects.join(', ') ?? '')
  const [classesStr, setClassesStr] = useState(staff?.classes.join(', ') ?? '')
  const [notes, setNotes] = useState(staff?.notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)

    if (!firstName.trim() || !lastName.trim() || !designation.trim() || !phone.trim()) {
      setError('First name, last name, designation, and primary phone are required.')
      return
    }

    const payload = {
      photoUrl: staff?.photoUrl ?? null,
      personalInfo: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        dateOfBirth: dateOfBirth || '1990-01-01',
        bloodGroup: bloodGroup.trim() || undefined,
        aadhaarNumber: aadhaarNumber.trim() || undefined,
        panNumber: panNumber.trim() || undefined,
      },
      contactInfo: {
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
      },
      employment: {
        employeeId: employeeId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        designation: designation.trim(),
        department,
        employmentType,
        status,
        dateOfJoining,
        salaryPaise: salaryRupees ? Number(salaryRupees) * 100 : undefined,
        reportingTo: reportingTo.trim() || undefined,
      },
      qualifications: staff?.qualifications ?? [],
      experience: staff?.experience ?? [],
      leaveBalance: {
        casual: staff?.leaveBalance.casual ?? 12,
        medical: staff?.leaveBalance.medical ?? 10,
        earned: staff?.leaveBalance.earned ?? 15,
        maternity: staff?.leaveBalance.maternity ?? 90,
        paternity: staff?.leaveBalance.paternity ?? 10,
      },
      subjects: subjectsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      classes: classesStr
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      notes: notes.trim() || undefined,
    }

    try {
      if (isNew) {
        const created = await createMutation.mutateAsync(payload)
        void navigate(paths.staffMember(created.id))
      } else if (staffId) {
        await updateMutation.mutateAsync({
          id: staffId,
          patch: payload,
        })
        void navigate(paths.staffMember(staffId))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save staff records.')
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <PageContainer
      title={isNew ? 'New Staff Onboarding' : `Edit Profile: ${firstName} ${lastName}`}
      eyebrow={
        <Link
          to={isNew ? paths.staff : paths.staffMember(staffId ?? '')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-ink"
        >
          <ArrowLeftIcon className="size-3" /> Back
        </Link>
      }
    >
      <form
        onSubmit={(e: SyntheticEvent) => {
          e.preventDefault()
          void handleSubmit()
        }}
        className="space-y-6"
      >
        {error && (
          <div className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* 1. Personal Info */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
            1. Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Select
              label="Gender"
              value={gender}
              options={[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'other', label: 'Other' },
              ]}
              onValueChange={setGender}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <Input
              label="Blood Group"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="e.g. B+"
            />
            <Input
              label="Aadhaar Number"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="12-digit UID"
            />
            <Input
              label="PAN Number"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
              placeholder="ABCDE1234F"
            />
          </div>
        </Card>

        {/* 2. Contact Info */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
            2. Contact Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Primary Phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Alternate Phone"
              type="tel"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
            />
            <Input
              label="Official Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="sm:col-span-3">
              <Textarea
                label="Residential Address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 3. Employment Details */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
            3. Employment & Position Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="EMP-0001"
            />
            <Input
              label="Designation / Title"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Teacher"
            />
            <Select
              label="Department"
              value={department}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              onValueChange={(val) => setDepartment(val as Department)}
            />
            <Select
              label="Employment Type"
              value={employmentType}
              options={EMPLOYMENT_TYPES.map((t) => ({ value: t, label: typeLabel(t) }))}
              onValueChange={(val) => setEmploymentType(val as EmploymentType)}
            />
            <Select
              label="Employment Status"
              value={status}
              options={EMPLOYMENT_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
              onValueChange={(val) => setStatus(val as EmploymentStatus)}
            />
            <Input
              label="Date of Joining"
              type="date"
              required
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.target.value)}
            />
            <Input
              label="Monthly Gross Salary (₹)"
              type="number"
              value={salaryRupees}
              onChange={(e) => setSalaryRupees(e.target.value)}
              placeholder="e.g. 45000"
            />
            <Input
              label="Reporting Manager / Supervisor"
              value={reportingTo}
              onChange={(e) => setReportingTo(e.target.value)}
              placeholder="e.g. Vice Principal"
            />
          </div>
        </Card>

        {/* 4. Teaching & Assignments */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
            4. Teaching Assignments & Notes
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Assigned Subjects (comma-separated)"
              value={subjectsStr}
              onChange={(e) => setSubjectsStr(e.target.value)}
              placeholder="Mathematics, Physics"
            />
            <Input
              label="Assigned Classes / Grades (comma-separated)"
              value={classesStr}
              onChange={(e) => setClassesStr(e.target.value)}
              placeholder="9, 10, 11"
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Administrative Notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes or remarks regarding this staff member..."
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              void navigate(isNew ? paths.staff : paths.staffMember(staffId ?? ''))
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isPending}
          >
            <CheckIcon className="size-4" />
            {isNew ? 'Create Staff Profile' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </PageContainer>
  )
}
