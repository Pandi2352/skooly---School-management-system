import { ArrowLeftIcon, FloppyDiskIcon, XCircleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Textarea } from '@/components/ui/Textarea'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useStudent } from '../hooks/useStudent'
import { useUpdateStudent } from '../hooks/useUpdateStudent'
import type { StudentDetail } from '../types/student.types'
import { formatClassSection } from '../utils/studentStatus'

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
]

const CATEGORY_OPTIONS = [
  { value: 'General', label: 'General' },
  { value: 'OBC', label: 'OBC (Other Backward Classes)' },
  { value: 'SC', label: 'SC (Scheduled Caste)' },
  { value: 'ST', label: 'ST (Scheduled Tribe)' },
  { value: 'EWS', label: 'EWS (Economically Weaker Section)' },
]

const HOUSE_OPTIONS = [
  { value: 'red', label: 'Red House' },
  { value: 'blue', label: 'Blue House' },
  { value: 'green', label: 'Green House' },
  { value: 'yellow', label: 'Yellow House' },
]

export function StudentEditPage() {
  const { studentId = '' } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const studentQuery = useStudent(studentId)
  const updateMutation = useUpdateStudent(studentId)

  if (studentQuery.isPending) {
    return (
      <PageContainer title="Edit Student Profile">
        <LoadingState label="Loading student data for editing" />
      </PageContainer>
    )
  }

  if (studentQuery.isError) {
    return (
      <PageContainer title="Edit Student Profile">
        <ErrorState
          title="Could not load student data"
          description={getErrorMessage(studentQuery.error)}
          onRetry={() => void studentQuery.refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <StudentEditForm
      student={studentQuery.data}
      isSaving={updateMutation.isPending}
      onSave={async (updates) => {
        await updateMutation.mutateAsync(updates)
        void navigate(paths.student(studentId))
      }}
      onCancel={() => {
        void navigate(paths.student(studentId))
      }}
    />
  )
}

type FormProps = {
  student: StudentDetail
  isSaving: boolean
  onSave: (updates: Partial<StudentDetail>) => Promise<void>
  onCancel: () => void
}

function StudentEditForm({ student, isSaving, onSave, onCancel }: FormProps) {
  // Academic fields
  const [grade, setGrade] = useState(String(student.grade))
  const [section, setSection] = useState(student.section)
  const [rollNo, setRollNo] = useState(student.rollNo)
  const [admissionNo, setAdmissionNo] = useState(student.admissionNo)
  const [admissionDate, setAdmissionDate] = useState(student.admissionDate)
  const [biometricId, setBiometricId] = useState(student.biometricId ?? '')
  const [previousSchool, setPreviousSchool] = useState(student.previousSchool ?? '')

  // Personal demographics
  const [name, setName] = useState(student.name)
  const [middleName, setMiddleName] = useState(student.middleName ?? '')
  const [dob, setDob] = useState(student.dob)
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(student.gender)
  const [bloodGroup, setBloodGroup] = useState(student.bloodGroup)
  const [category, setCategory] = useState(student.category ?? 'General')
  const [house, setHouse] = useState(student.house ?? '')
  const [religion, setReligion] = useState(student.religion ?? '')
  const [nationalId, setNationalId] = useState(student.nationalId ?? '')
  const [penId, setPenId] = useState(student.penId ?? '')
  const [caste, setCaste] = useState(student.caste ?? '')
  const [subCaste, setSubCaste] = useState(student.subCaste ?? '')
  const [motherTongue, setMotherTongue] = useState(student.motherTongue ?? '')
  const [nationality, setNationality] = useState(student.nationality ?? 'Indian')
  const [placeOfBirth, setPlaceOfBirth] = useState(student.placeOfBirth ?? '')
  const [bpl, setBpl] = useState(Boolean(student.belowPovertyLine))
  const [rte, setRte] = useState(Boolean(student.rightToEducation))
  const [studentPhone, setStudentPhone] = useState(student.studentPhone ?? '')
  const [studentEmail, setStudentEmail] = useState(student.studentEmail ?? '')

  // Residential Address
  const [residentialAddress, setResidentialAddress] = useState(student.residentialAddress)
  const [city, setCity] = useState(student.city)
  const [pincode, setPincode] = useState(student.pincode)

  // Primary Guardian
  const [guardianName, setGuardianName] = useState(student.primaryGuardian.name)
  const [guardianRelation, setGuardianRelation] = useState(student.primaryGuardian.relation)
  const [guardianPhone, setGuardianPhone] = useState(student.primaryGuardian.phone)
  const [guardianEmail, setGuardianEmail] = useState(student.primaryGuardian.email ?? '')
  const [guardianOccupation, setGuardianOccupation] = useState(student.primaryGuardian.occupation ?? '')

  // Parents extended
  const [fatherName, setFatherName] = useState(student.parents?.fatherName ?? student.guardianName)
  const [fatherPhone, setFatherPhone] = useState(student.parents?.fatherPhone ?? student.guardianPhone)
  const [fatherOccupation, setFatherOccupation] = useState(student.parents?.fatherOccupation ?? '')
  const [fatherQualification, setFatherQualification] = useState(student.parents?.fatherQualification ?? '')
  const [fatherAadhaar, setFatherAadhaar] = useState(student.parents?.fatherAadhaar ?? '')
  const [fatherIncomePaise, setFatherIncomePaise] = useState(
    student.parents?.fatherIncomePaise != null ? String(student.parents.fatherIncomePaise / 100) : '',
  )

  const [motherName, setMotherName] = useState(student.parents?.motherName ?? '')
  const [motherPhone, setMotherPhone] = useState(student.parents?.motherPhone ?? '')
  const [motherOccupation, setMotherOccupation] = useState(student.parents?.motherOccupation ?? '')
  const [motherQualification, setMotherQualification] = useState(student.parents?.motherQualification ?? '')
  const [motherAadhaar, setMotherAadhaar] = useState(student.parents?.motherAadhaar ?? '')

  const [emergencyName, setEmergencyName] = useState(student.parents?.emergencyName ?? '')
  const [emergencyPhone, setEmergencyPhone] = useState(student.parents?.emergencyPhone ?? '')
  const [permanentAddress, setPermanentAddress] = useState(student.parents?.permanentAddress ?? '')

  // Health
  const [heightCm, setHeightCm] = useState(student.heightCm ?? '')
  const [weightKg, setWeightKg] = useState(student.weightKg ?? '')
  const [allergies, setAllergies] = useState(student.medical.allergies.join(', '))
  const [medications, setMedications] = useState(student.medical.medications.join(', '))
  const [doctorNotes, setDoctorNotes] = useState(student.medical.doctorNotes ?? '')

  // Bank
  const [bankName, setBankName] = useState(student.bank?.bankName ?? '')
  const [accountNumber, setAccountNumber] = useState(student.bank?.accountNumber ?? '')
  const [ifscCode, setIfscCode] = useState(student.bank?.ifscCode ?? '')
  const [accountHolderName, setAccountHolderName] = useState(student.bank?.accountHolderName ?? '')

  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSaveError(null)

    const incomeNumber = fatherIncomePaise.trim() ? Math.round(parseFloat(fatherIncomePaise) * 100) : null

    try {
      await onSave({
        name,
        middleName: middleName.trim() || undefined,
        grade: parseInt(grade, 10),
        section,
        rollNo,
        admissionNo,
        admissionDate,
        biometricId: biometricId.trim() || undefined,
        previousSchool: previousSchool.trim() || undefined,
        dob,
        gender,
        bloodGroup,
        category,
        house: house.trim() || undefined,
        religion: religion.trim() || undefined,
        nationalId: nationalId.trim() || undefined,
        penId: penId.trim() || undefined,
        caste: caste.trim() || undefined,
        subCaste: subCaste.trim() || undefined,
        motherTongue: motherTongue.trim() || undefined,
        nationality,
        placeOfBirth: placeOfBirth.trim() || undefined,
        belowPovertyLine: bpl,
        rightToEducation: rte,
        studentPhone: studentPhone.trim() || undefined,
        studentEmail: studentEmail.trim() || undefined,
        residentialAddress,
        city,
        pincode,
        heightCm: heightCm.trim() || undefined,
        weightKg: weightKg.trim() || undefined,
        primaryGuardian: {
          ...student.primaryGuardian,
          name: guardianName,
          relation: guardianRelation,
          phone: guardianPhone,
          email: guardianEmail.trim() || undefined,
          occupation: guardianOccupation.trim() || undefined,
        },
        parents: {
          fatherName: fatherName.trim() || undefined,
          fatherPhone: fatherPhone.trim() || undefined,
          fatherOccupation: fatherOccupation.trim() || undefined,
          fatherQualification: fatherQualification.trim() || undefined,
          fatherAadhaar: fatherAadhaar.trim() || undefined,
          fatherIncomePaise: Number.isNaN(incomeNumber) ? null : incomeNumber,
          motherName: motherName.trim() || undefined,
          motherPhone: motherPhone.trim() || undefined,
          motherOccupation: motherOccupation.trim() || undefined,
          motherQualification: motherQualification.trim() || undefined,
          motherAadhaar: motherAadhaar.trim() || undefined,
          emergencyName: emergencyName.trim() || undefined,
          emergencyPhone: emergencyPhone.trim() || undefined,
          permanentAddress: permanentAddress.trim() || undefined,
        },
        bank: {
          bankName: bankName.trim() || undefined,
          accountNumber: accountNumber.trim() || undefined,
          ifscCode: ifscCode.trim() || undefined,
          accountHolderName: accountHolderName.trim() || undefined,
        },
        medical: {
          ...student.medical,
          allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
          medications: medications.split(',').map((s) => s.trim()).filter(Boolean),
          doctorNotes: doctorNotes.trim() || undefined,
        },
      })
    } catch (err) {
      setSaveError(getErrorMessage(err))
    }
  }

  const tabs: TabItem[] = [
    {
      value: 'academic',
      label: 'Academic & Enrollment',
      content: (
        <Card title="Academic Milestones" description="Class placement, admission details and school tracking credentials.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Admission Number"
              value={admissionNo}
              onChange={(e) => setAdmissionNo(e.target.value)}
              required
            />
            <Input
              label="Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />
            <Input
              label="Admission Date"
              type="date"
              value={admissionDate}
              onChange={(e) => setAdmissionDate(e.target.value)}
              required
            />
            <Input
              label="Class Grade"
              type="number"
              min={1}
              max={12}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
            <Input
              label="Section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
            <Input
              label="Biometric Device ID"
              value={biometricId}
              onChange={(e) => setBiometricId(e.target.value)}
              placeholder="e.g. BIO-5014"
            />
            <div className="sm:col-span-2 lg:col-span-3">
              <Input
                label="Previous School Attended"
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                placeholder="School name and location"
              />
            </div>
          </div>
        </Card>
      ),
    },
    {
      value: 'personal',
      label: 'Personal & Identity',
      content: (
        <Card title="Personal Information & Identification" description="Official identity, demographics, and statutory quotas.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Student Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Optional middle name"
            />
            <Input
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
            <Select
              label="Gender"
              options={GENDER_OPTIONS}
              value={gender}
              onValueChange={(val) => setGender(val as 'male' | 'female' | 'other')}
            />
            <Select
              label="Blood Group"
              options={BLOOD_GROUP_OPTIONS}
              value={bloodGroup}
              onValueChange={setBloodGroup}
            />
            <Select
              label="Category"
              options={CATEGORY_OPTIONS}
              value={category}
              onValueChange={setCategory}
            />
            <Select
              label="House"
              options={HOUSE_OPTIONS}
              value={house}
              onValueChange={setHouse}
              placeholder="Select House"
            />
            <Input
              label="Religion"
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
              placeholder="e.g. Hindu, Muslim, Christian"
            />
            <Input
              label="National ID / Aadhaar"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="12-digit number"
            />
            <Input
              label="PEN Number"
              value={penId}
              onChange={(e) => setPenId(e.target.value)}
              placeholder="Permanent Education Number"
            />
            <Input
              label="Caste"
              value={caste}
              onChange={(e) => setCaste(e.target.value)}
              placeholder="Caste category"
            />
            <Input
              label="Sub-Caste"
              value={subCaste}
              onChange={(e) => setSubCaste(e.target.value)}
              placeholder="Sub-caste / community"
            />
            <Input
              label="Mother Tongue"
              value={motherTongue}
              onChange={(e) => setMotherTongue(e.target.value)}
              placeholder="e.g. Kannada, Hindi, Tamil"
            />
            <Input
              label="Place of Birth"
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
              placeholder="City, District"
            />
            <Input
              label="Nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
            <Input
              label="Student Direct Phone"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              placeholder="+91..."
            />
            <Input
              label="Student Direct Email"
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="student@example.com"
            />
            <div className="flex flex-col gap-2 pt-5 sm:col-span-2">
              <Checkbox
                id="bpl-check"
                label="Below Poverty Line (BPL) Quota"
                checked={bpl}
                onCheckedChange={(c) => setBpl(Boolean(c))}
              />
              <Checkbox
                id="rte-check"
                label="Right to Education (RTE) Candidate"
                checked={rte}
                onCheckedChange={(c) => setRte(Boolean(c))}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 border-t border-line pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Residential Address</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Input
                    label="Street Address"
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input
                  label="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </Card>
      ),
    },
    {
      value: 'guardians',
      label: 'Family & Guardians',
      content: (
        <div className="grid gap-6">
          <Card title="Primary Guardian" description="Designated legal guardian and billing recipient.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Guardian Full Name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                required
              />
              <Input
                label="Relationship"
                value={guardianRelation}
                onChange={(e) => setGuardianRelation(e.target.value)}
                required
              />
              <Input
                label="Contact Phone"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
              />
              <Input
                label="Occupation"
                value={guardianOccupation}
                onChange={(e) => setGuardianOccupation(e.target.value)}
              />
            </div>
          </Card>

          <Card title="Father's Profile" description="Employment, education and identification.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Father Full Name"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
              />
              <Input
                label="Father Phone"
                value={fatherPhone}
                onChange={(e) => setFatherPhone(e.target.value)}
              />
              <Input
                label="Father Occupation"
                value={fatherOccupation}
                onChange={(e) => setFatherOccupation(e.target.value)}
              />
              <Input
                label="Educational Qualification"
                value={fatherQualification}
                onChange={(e) => setFatherQualification(e.target.value)}
              />
              <Input
                label="Aadhaar / National ID"
                value={fatherAadhaar}
                onChange={(e) => setFatherAadhaar(e.target.value)}
              />
              <Input
                label="Annual Income (₹)"
                type="number"
                value={fatherIncomePaise}
                onChange={(e) => setFatherIncomePaise(e.target.value)}
                placeholder="e.g. 1500000"
              />
            </div>
          </Card>

          <Card title="Mother's Profile" description="Employment, education and identification.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Mother Full Name"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
              />
              <Input
                label="Mother Phone"
                value={motherPhone}
                onChange={(e) => setMotherPhone(e.target.value)}
              />
              <Input
                label="Mother Occupation"
                value={motherOccupation}
                onChange={(e) => setMotherOccupation(e.target.value)}
              />
              <Input
                label="Educational Qualification"
                value={motherQualification}
                onChange={(e) => setMotherQualification(e.target.value)}
              />
              <Input
                label="Aadhaar / National ID"
                value={motherAadhaar}
                onChange={(e) => setMotherAadhaar(e.target.value)}
              />
            </div>
          </Card>

          <Card title="Emergency & Permanent Residence" description="Emergency reach and verified living address.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Emergency Contact Name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
              />
              <Input
                label="Emergency Contact Phone"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Permanent Living Address"
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  placeholder="Full permanent residential address"
                />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      value: 'medical',
      label: 'Health & Medical',
      content: (
        <Card title="Health Records & Physical Metrics" description="Medical profile and emergency care guidelines.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Height (cm)"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 138"
            />
            <Input
              label="Weight (kg)"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 32.5"
            />
            <div className="sm:col-span-2">
              <Input
                label="Known Allergies (comma-separated)"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Peanuts, Dust, Pollen"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Ongoing Medications (comma-separated)"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="e.g. Inhaler as needed"
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Doctor / School Nurse Notes"
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </Card>
      ),
    },
    {
      value: 'bank',
      label: 'Bank & Direct Billing',
      content: (
        <Card title="Disbursement & Fee Bank Details" description="Bank credentials on record for scholarship, fee refunds, or auto-debit.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. State Bank of India, HDFC Bank"
            />
            <Input
              label="Account Holder Name"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="Name as printed in passbook"
            />
            <Input
              label="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Bank account number"
            />
            <Input
              label="IFSC Code"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="e.g. SBIN0001234"
            />
          </div>
        </Card>
      ),
    },
  ]

  return (
    <PageContainer
      title={`Edit Profile: ${student.name}`}
      eyebrow={
        <Link
          to={paths.student(student.id)}
          className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted transition-colors hover:text-primary"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
          Back to Student Profile
        </Link>
      }
      description={`Admission No: ${student.admissionNo} · Class ${formatClassSection(student)}`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            <XCircleIcon className="mr-1.5 size-4" />
            Cancel
          </Button>
          <Button variant="primary" onClick={(e) => void handleSubmit(e)} disabled={isSaving}>
            <FloppyDiskIcon className="mr-1.5 size-4" weight="bold" />
            {isSaving ? 'Saving Changes...' : 'Save Student Changes'}
          </Button>
        </div>
      }
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-6">
        {saveError && (
          <Alert tone="danger" title="Could not save changes">
            {saveError}
          </Alert>
        )}
        <Tabs label="Student Edit Sections" items={tabs} defaultValue="academic" />
        <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSaving}>
            <FloppyDiskIcon className="mr-1.5 size-4" weight="bold" />
            {isSaving ? 'Saving Changes...' : 'Save Student Changes'}
          </Button>
        </div>
      </form>
    </PageContainer>
  )
}
