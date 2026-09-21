import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/lib/api/ApiError'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { GRADE_FILTER_OPTIONS } from '../constants/admissionFilters'
import { useUpdateAdmissionDetails } from '../hooks/useAdmissionPipeline'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'

type EditAdmissionDialogProps = {
  application: AdmissionApplication | null
  onClose: () => void
}

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
  { value: 'EWS', label: 'EWS' },
]

const HOUSE_OPTIONS = [
  { value: 'red', label: 'Red House' },
  { value: 'blue', label: 'Blue House' },
  { value: 'green', label: 'Green House' },
  { value: 'yellow', label: 'Yellow House' },
]

const GUARDIAN_TYPE_OPTIONS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'guardian', label: 'Other Legal Guardian' },
]

export function EditAdmissionDialog({ application, onClose }: EditAdmissionDialogProps) {
  const updateDetails = useUpdateAdmissionDetails()
  const { toast } = useToast()

  if (!application) return null

  return (
    <EditAdmissionDialogContent
      key={application._id}
      application={application}
      onClose={onClose}
      onSave={async (input) => {
        try {
          await updateDetails.mutateAsync({ id: application._id, input })
          toast.success('Application updated', `${application.applicationNo} has been corrected.`)
          onClose()
        } catch (error) {
          if (error instanceof ApiError && error.errorCode === 'ADMISSION_NO_CHANGES') {
            toast.info('Nothing changed', 'Edit a detail before saving.')
            return
          }
          toast.error('Update failed', getErrorMessage(error))
        }
      }}
      isSaving={updateDetails.isPending}
    />
  )
}

type ContentProps = {
  application: AdmissionApplication
  onClose: () => void
  onSave: (input: Parameters<ReturnType<typeof useUpdateAdmissionDetails>['mutateAsync']>[0]['input']) => Promise<void>
  isSaving: boolean
}

function EditAdmissionDialogContent({ application, onClose, onSave, isSaving }: ContentProps) {
  // Academic
  const [gradeApplied, setGradeApplied] = useState(String(application.student.gradeApplied))
  const [admissionNo, setAdmissionNo] = useState(application.academic?.admissionNo ?? '')
  const [rollNo, setRollNo] = useState(application.academic?.rollNo ?? '')
  const [admissionDate, setAdmissionDate] = useState(application.academic?.admissionDate ?? '')
  const [biometricId, setBiometricId] = useState(application.academic?.biometricId ?? '')
  const [previousSchool, setPreviousSchool] = useState(application.student.previousSchool)

  // Personal
  const [firstName, setFirstName] = useState(application.student.firstName)
  const [middleName, setMiddleName] = useState(application.student.middleName ?? '')
  const [lastName, setLastName] = useState(application.student.lastName)
  const [dateOfBirth, setDateOfBirth] = useState(application.student.dateOfBirth)
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(application.student.gender)
  const [bloodGroup, setBloodGroup] = useState(application.student.bloodGroup)
  const [category, setCategory] = useState(application.student.category ?? 'General')
  const [house, setHouse] = useState(application.student.house ?? '')
  const [religion, setReligion] = useState(application.student.religion ?? '')
  const [nationalId, setNationalId] = useState(application.student.nationalId ?? '')
  const [penId, setPenId] = useState(application.student.penId ?? '')
  const [caste, setCaste] = useState(application.student.caste ?? '')
  const [subCaste, setSubCaste] = useState(application.student.subCaste ?? '')
  const [motherTongue, setMotherTongue] = useState(application.student.motherTongue ?? '')
  const [nationality, setNationality] = useState(application.student.nationality ?? 'Indian')
  const [placeOfBirth, setPlaceOfBirth] = useState(application.student.placeOfBirth ?? '')
  const [belowPovertyLine, setBelowPovertyLine] = useState(Boolean(application.student.belowPovertyLine))
  const [rightToEducation, setRightToEducation] = useState(Boolean(application.student.rightToEducation))
  const [studentPhone, setStudentPhone] = useState(application.student.phone ?? '')
  const [studentEmail, setStudentEmail] = useState(application.student.email ?? '')

  // Parents
  const [guardianType, setGuardianType] = useState<'father' | 'mother' | 'guardian'>(application.parent.guardianType)
  const [parentName, setParentName] = useState(application.parent.name)
  const [parentPhone, setParentPhone] = useState(application.parent.phone)
  const [parentEmail, setParentEmail] = useState(application.parent.email)
  const [parentOccupation, setParentOccupation] = useState(application.parent.occupation)
  const [parentAddress, setParentAddress] = useState(application.parent.address)
  const [fatherName, setFatherName] = useState(application.parent.fatherName ?? '')
  const [fatherPhone, setFatherPhone] = useState(application.parent.fatherPhone ?? '')
  const [fatherOccupation, setFatherOccupation] = useState(application.parent.fatherOccupation ?? '')
  const [fatherQualification, setFatherQualification] = useState(application.parent.fatherQualification ?? '')
  const [fatherAadhaar, setFatherAadhaar] = useState(application.parent.fatherAadhaar ?? '')
  const [fatherIncome, setFatherIncome] = useState(
    application.parent.fatherIncomePaise != null ? String(application.parent.fatherIncomePaise / 100) : '',
  )

  const [motherName, setMotherName] = useState(application.parent.motherName ?? '')
  const [motherPhone, setMotherPhone] = useState(application.parent.motherPhone ?? '')
  const [motherOccupation, setMotherOccupation] = useState(application.parent.motherOccupation ?? '')
  const [motherQualification, setMotherQualification] = useState(application.parent.motherQualification ?? '')
  const [motherAadhaar, setMotherAadhaar] = useState(application.parent.motherAadhaar ?? '')

  const [emergencyName, setEmergencyName] = useState(application.parent.emergencyName ?? '')
  const [emergencyPhone, setEmergencyPhone] = useState(application.parent.emergencyPhone ?? '')
  const [permanentAddress, setPermanentAddress] = useState(application.parent.permanentAddress ?? '')

  // Health
  const [heightCm, setHeightCm] = useState(application.health?.heightCm ?? '')
  const [weightKg, setWeightKg] = useState(application.health?.weightKg ?? '')
  const [medicalConditions, setMedicalConditions] = useState(application.health?.medicalConditions ?? '')
  const [allergies, setAllergies] = useState(application.health?.allergies ?? '')

  // Bank
  const [bankName, setBankName] = useState(application.bank?.bankName ?? '')
  const [accountNumber, setAccountNumber] = useState(application.bank?.accountNumber ?? '')
  const [ifscCode, setIfscCode] = useState(application.bank?.ifsc ?? '')
  const [accountHolderName, setAccountHolderName] = useState(application.bank?.accountHolder ?? '')

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const parsedIncome = fatherIncome.trim() ? Math.round(parseFloat(fatherIncome) * 100) : null

    await onSave({
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastName: lastName.trim(),
      dateOfBirth,
      gender,
      gradeApplied: parseInt(gradeApplied, 10),
      bloodGroup: bloodGroup.trim() || undefined,
      previousSchool: previousSchool.trim() || undefined,
      category: category.trim() || undefined,
      house: house.trim() || undefined,
      religion: religion.trim() || undefined,
      nationalId: nationalId.trim() || undefined,
      penId: penId.trim() || undefined,
      caste: caste.trim() || undefined,
      subCaste: subCaste.trim() || undefined,
      motherTongue: motherTongue.trim() || undefined,
      placeOfBirth: placeOfBirth.trim() || undefined,
      nationality: nationality.trim() || undefined,
      belowPovertyLine,
      rightToEducation,
      phone: studentPhone.trim() || undefined,
      email: studentEmail.trim() || undefined,
      admissionNo: admissionNo.trim() || undefined,
      rollNo: rollNo.trim() || undefined,
      admissionDate: admissionDate.trim() || undefined,
      biometricId: biometricId.trim() || undefined,
      guardianType,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
      parentOccupation: parentOccupation.trim() || undefined,
      parentAddress: parentAddress.trim() || undefined,
      fatherName: fatherName.trim() || undefined,
      fatherPhone: fatherPhone.trim() || undefined,
      fatherOccupation: fatherOccupation.trim() || undefined,
      fatherQualification: fatherQualification.trim() || undefined,
      fatherAadhaar: fatherAadhaar.trim() || undefined,
      fatherIncomePaise: Number.isNaN(parsedIncome) ? null : parsedIncome,
      motherName: motherName.trim() || undefined,
      motherPhone: motherPhone.trim() || undefined,
      motherOccupation: motherOccupation.trim() || undefined,
      motherQualification: motherQualification.trim() || undefined,
      motherAadhaar: motherAadhaar.trim() || undefined,
      emergencyName: emergencyName.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() || undefined,
      permanentAddress: permanentAddress.trim() || undefined,
      heightCm: heightCm.trim() || undefined,
      weightKg: weightKg.trim() || undefined,
      medicalConditions: medicalConditions.trim() || undefined,
      allergies: allergies.trim() || undefined,
      bankName: bankName.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
      ifscCode: ifscCode.trim() || undefined,
      accountHolderName: accountHolderName.trim() || undefined,
    })
  }

  const tabs: TabItem[] = [
    {
      value: 'academic',
      label: 'Academic & Grade',
      content: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <Select
            label="Grade applied for"
            required
            value={gradeApplied}
            onValueChange={setGradeApplied}
            options={GRADE_FILTER_OPTIONS.filter((option) => option.value !== 'all')}
          />
          <Input
            label="Previous School"
            value={previousSchool}
            onChange={(e) => setPreviousSchool(e.target.value)}
            placeholder="e.g. St. Xavier Primary"
          />
          <Input
            label="Admission No (if assigned)"
            value={admissionNo}
            onChange={(e) => setAdmissionNo(e.target.value)}
            placeholder="e.g. ADM-2026-001"
          />
          <Input
            label="Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="e.g. 14"
          />
          <Input
            label="Admission Date"
            type="date"
            value={admissionDate}
            onChange={(e) => setAdmissionDate(e.target.value)}
          />
          <Input
            label="Biometric ID"
            value={biometricId}
            onChange={(e) => setBiometricId(e.target.value)}
            placeholder="e.g. BIO-5014"
          />
        </div>
      ),
    },
    {
      value: 'personal',
      label: 'Applicant & Identity',
      content: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
          <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input label="Date of Birth" type="date" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          <Select label="Gender" options={GENDER_OPTIONS} value={gender} onValueChange={(v) => setGender(v as 'male' | 'female' | 'other')} />
          <Select label="Blood Group" options={BLOOD_GROUP_OPTIONS} value={bloodGroup} onValueChange={setBloodGroup} />
          <Select label="Category" options={CATEGORY_OPTIONS} value={category} onValueChange={setCategory} />
          <Select label="House" options={HOUSE_OPTIONS} value={house} onValueChange={setHouse} />
          <Input label="National ID / Aadhaar" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />
          <Input label="PEN ID" value={penId} onChange={(e) => setPenId(e.target.value)} />
          <Input label="Religion" value={religion} onChange={(e) => setReligion(e.target.value)} />
          <Input label="Mother Tongue" value={motherTongue} onChange={(e) => setMotherTongue(e.target.value)} />
          <Input label="Caste" value={caste} onChange={(e) => setCaste(e.target.value)} />
          <Input label="Sub-Caste" value={subCaste} onChange={(e) => setSubCaste(e.target.value)} />
          <Input label="Place of Birth" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} />
          <Input label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
          <div className="sm:col-span-2 flex flex-col gap-2 pt-2 border-t border-line">
            <Checkbox id="edit-bpl" label="Below Poverty Line (BPL) Quota" checked={belowPovertyLine} onCheckedChange={(c) => setBelowPovertyLine(Boolean(c))} />
            <Checkbox id="edit-rte" label="Right to Education (RTE) Candidate" checked={rightToEducation} onCheckedChange={(c) => setRightToEducation(Boolean(c))} />
          </div>
          <Input label="Applicant Direct Phone" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} />
          <Input label="Applicant Direct Email" type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
        </div>
      ),
    },
    {
      value: 'family',
      label: 'Parents & Family',
      content: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <Select
            label="Primary Guardian Type"
            options={GUARDIAN_TYPE_OPTIONS}
            value={guardianType}
            onValueChange={(v) => setGuardianType(v as 'father' | 'mother' | 'guardian')}
          />
          <Input label="Primary Guardian Name" required value={parentName} onChange={(e) => setParentName(e.target.value)} />
          <Input label="Contact Phone" required value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
          <Input label="Contact Email" type="email" required value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
          <Input label="Guardian Occupation" value={parentOccupation} onChange={(e) => setParentOccupation(e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Residential Address" value={parentAddress} onChange={(e) => setParentAddress(e.target.value)} />
          </div>
          <div className="sm:col-span-2 border-t border-line pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">Father Profile</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Father Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
              <Input label="Father Phone" value={fatherPhone} onChange={(e) => setFatherPhone(e.target.value)} />
              <Input label="Occupation" value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} />
              <Input label="Qualification" value={fatherQualification} onChange={(e) => setFatherQualification(e.target.value)} />
              <Input label="Aadhaar ID" value={fatherAadhaar} onChange={(e) => setFatherAadhaar(e.target.value)} />
              <Input label="Annual Income (₹)" type="number" value={fatherIncome} onChange={(e) => setFatherIncome(e.target.value)} />
            </div>
          </div>
          <div className="sm:col-span-2 border-t border-line pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">Mother Profile</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Mother Name" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
              <Input label="Mother Phone" value={motherPhone} onChange={(e) => setMotherPhone(e.target.value)} />
              <Input label="Occupation" value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} />
              <Input label="Qualification" value={motherQualification} onChange={(e) => setMotherQualification(e.target.value)} />
              <Input label="Aadhaar ID" value={motherAadhaar} onChange={(e) => setMotherAadhaar(e.target.value)} />
            </div>
          </div>
          <div className="sm:col-span-2 border-t border-line pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">Emergency & Permanent Home</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Emergency Contact Name" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
              <Input label="Emergency Contact Phone" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
              <div className="sm:col-span-2">
                <Input label="Permanent Living Address" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: 'health-bank',
      label: 'Health & Bank',
      content: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <Input label="Height (cm)" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 138" />
          <Input label="Weight (kg)" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g. 32.5" />
          <div className="sm:col-span-2">
            <Input label="Medical Conditions" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Input label="Known Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
          </div>
          <div className="sm:col-span-2 border-t border-line pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">Bank Details</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              <Input label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              <Input label="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
              <Input label="Account Holder Name" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      size="lg"
      title={`Edit Application: ${application.applicationNo}`}
      description="Update any details recorded during admission before or after review."
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-4" noValidate>
        <Tabs label="Application Edit Sections" items={tabs} defaultValue="academic" />

        <div className="flex justify-end gap-2 pt-3 border-t border-line">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" loading={isSaving}>
            Save All Changes
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
