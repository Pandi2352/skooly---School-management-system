import {
  CalendarIcon,
  CheckCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PhoneCallIcon,
  PlusIcon,
  UserPlusIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { PageContainer } from '@/components/page/PageContainer'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { useToast } from '@/hooks/useToast'

export type InquiryStatus = 'new' | 'contacted' | 'tour-scheduled' | 'converted' | 'closed'

export type AdmissionInquiry = {
  id: string
  childName: string
  gradeApplied: number
  parentName: string
  parentPhone: string
  parentEmail: string
  source: 'Walk-in' | 'Phone Call' | 'Website Portal' | 'Referral' | 'Social Media'
  inquiryDate: string
  followUpDate: string
  counselorNotes: string
  status: InquiryStatus
}

const SAMPLE_INQUIRIES: AdmissionInquiry[] = [
  {
    id: 'INQ-2026-001',
    childName: 'Reyansh Gupta',
    gradeApplied: 1,
    parentName: 'Alok Gupta',
    parentPhone: '+91 98451 22334',
    parentEmail: 'alok.gupta@example.com',
    source: 'Walk-in',
    inquiryDate: '2026-03-01',
    followUpDate: '2026-03-05',
    counselorNotes: 'Walked into reception asking for Grade 1 curriculum & transportation coverage in Indiranagar.',
    status: 'tour-scheduled',
  },
  {
    id: 'INQ-2026-002',
    childName: 'Samaira Rao',
    gradeApplied: 6,
    parentName: 'Kavita Rao',
    parentPhone: '+91 97420 88991',
    parentEmail: 'kavita.rao@example.com',
    source: 'Website Portal',
    inquiryDate: '2026-03-02',
    followUpDate: '2026-03-04',
    counselorNotes: 'Online inquiry for middle school transfer from ICSE board. Interested in robotics lab.',
    status: 'contacted',
  },
  {
    id: 'INQ-2026-003',
    childName: 'Vihaan Joshi',
    gradeApplied: 9,
    parentName: 'Sanjay Joshi',
    parentPhone: '+91 99002 44556',
    parentEmail: 'sanjay.joshi@example.com',
    source: 'Phone Call',
    inquiryDate: '2026-03-03',
    followUpDate: '2026-03-06',
    counselorNotes: 'Inquired about secondary science lab facilities and sports training schedule.',
    status: 'new',
  },
  {
    id: 'INQ-2026-004',
    childName: 'Aanya Kulkarni',
    gradeApplied: 4,
    parentName: 'Deepa Kulkarni',
    parentPhone: '+91 98860 11223',
    parentEmail: 'deepa.k@example.com',
    source: 'Referral',
    inquiryDate: '2026-02-28',
    followUpDate: '2026-03-02',
    counselorNotes: 'Elder sister studying in Grade 8. Completed campus tour and proceeded to walk-in admission.',
    status: 'converted',
  },
  {
    id: 'INQ-2026-005',
    childName: 'Kabir Sengupta',
    gradeApplied: 11,
    parentName: 'Debabrata Sengupta',
    parentPhone: '+91 98450 77889',
    parentEmail: 'debabrata@example.com',
    source: 'Walk-in',
    inquiryDate: '2026-02-25',
    followUpDate: '2026-03-01',
    counselorNotes: 'Looking for Commerce with Applied Mathematics. Decided to relocate out of city.',
    status: 'closed',
  },
]

const statusLabels: Record<InquiryStatus, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  'tour-scheduled': 'Tour Scheduled',
  converted: 'Converted to App',
  closed: 'Closed / Dropped',
}

const statusTones: Record<InquiryStatus, BadgeTone> = {
  new: 'neutral',
  contacted: 'planned',
  'tour-scheduled': 'planned',
  converted: 'neutral',
  closed: 'danger',
}

export function AdmissionsInquiriesPage() {
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>(SAMPLE_INQUIRIES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { toast } = useToast()

  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      inq.childName.toLowerCase().includes(q) ||
      inq.parentName.toLowerCase().includes(q) ||
      inq.parentPhone.includes(q) ||
      inq.id.toLowerCase().includes(q)
    )
  })

  const totalInquiries = inquiries.length
  const newLeads = inquiries.filter((i) => i.status === 'new').length
  const toursScheduled = inquiries.filter((i) => i.status === 'tour-scheduled').length
  const convertedCount = inquiries.filter((i) => i.status === 'converted').length

  const handleCreateInquiry = (newInquiry: Omit<AdmissionInquiry, 'id'>) => {
    const id = `INQ-2026-${String(inquiries.length + 1).padStart(3, '0')}`
    setInquiries([{ ...newInquiry, id }, ...inquiries])
    toast.success('Inquiry Logged', `Lead for ${newInquiry.childName} recorded successfully.`)
    setIsAddOpen(false)
  }

  const columns: TableColumn<AdmissionInquiry>[] = [
    {
      key: 'child',
      header: 'Child & Grade',
      cell: (inq) => (
        <div>
          <div className="font-semibold text-ink">{inq.childName}</div>
          <div className="text-xs text-ink-muted">Grade {inq.gradeApplied} · {inq.id}</div>
        </div>
      ),
    },
    {
      key: 'parent',
      header: 'Parent / Contact',
      cell: (inq) => (
        <div>
          <div className="font-medium text-ink">{inq.parentName}</div>
          <div className="text-xs text-ink-muted tabular-nums">{inq.parentPhone}</div>
        </div>
      ),
    },
    {
      key: 'source',
      header: 'Lead Source',
      cell: (inq) => <span className="text-xs font-medium text-ink">{inq.source}</span>,
    },
    {
      key: 'date',
      header: 'Inquiry Date',
      cell: (inq) => <span className="tabular-nums text-xs text-ink">{inq.inquiryDate}</span>,
    },
    {
      key: 'followUp',
      header: 'Follow-up Due',
      cell: (inq) => (
        <span className="tabular-nums text-xs font-semibold text-ink">
          {inq.followUpDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (inq) => (
        <Badge tone={statusTones[inq.status]}>
          {statusLabels[inq.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (inq) => (
        <div className="flex items-center justify-end gap-2">
          {inq.status !== 'converted' && (
            <Link
              to={paths.studentNew}
              className="inline-flex h-7 items-center rounded border border-line bg-surface px-2 text-xs font-semibold text-primary transition-colors hover:bg-canvas"
            >
              <UserPlusIcon className="mr-1 size-3.5" />
              Direct Admission
            </Link>
          )}
          {inq.status === 'converted' && (
            <span className="flex items-center text-xs font-semibold text-success">
              <CheckCircleIcon className="mr-1 size-4" weight="fill" />
              Admitted
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <PageContainer
      title="Admission Inquiries & Leads"
      description="Track prospective families, walk-in inquiries, campus tours, and enrollment conversion."
      actions={
        <div className="flex items-center gap-2">
          <Link
            to={paths.studentNew}
            className="inline-flex h-9 items-center justify-center rounded-md border border-line bg-surface px-3 text-xs font-semibold text-ink hover:bg-canvas"
          >
            <UserPlusIcon className="mr-1.5 size-4" />
            Walk-in Admission
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
            <PlusIcon className="mr-1.5 size-4" weight="bold" />
            Log New Inquiry
          </Button>
        </div>
      }
      fullWidth
    >
      <div className="grid gap-5">
        {/* KPI stat tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-line bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Total Inquiries</span>
              <UsersIcon className="size-4 text-primary" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{totalInquiries}</div>
            <div className="mt-0.5 text-xs text-ink-muted">Current academic cycle</div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>New Leads</span>
              <PhoneCallIcon className="size-4 text-accent" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{newLeads}</div>
            <div className="mt-0.5 text-xs text-ink-muted">Pending initial contact</div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Tours Scheduled</span>
              <CalendarIcon className="size-4 text-primary" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{toursScheduled}</div>
            <div className="mt-0.5 text-xs text-ink-muted">Campus walk-in visits</div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Converted</span>
              <CheckCircleIcon className="size-4 text-success" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{convertedCount}</div>
            <div className="mt-0.5 text-xs text-ink-muted">Enrolled into school</div>
          </div>
        </div>

        {/* Filters and search card */}
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-72">
              <Input
                label="Search Inquiries"
                hideLabel
                placeholder="Search by student, parent or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={MagnifyingGlassIcon}
              />
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="size-4 text-ink-muted" />
              <Select
                label="Filter Status"
                hideLabel
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'All Inquiries' },
                  { value: 'new', label: 'New Leads' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'tour-scheduled', label: 'Tour Scheduled' },
                  { value: 'converted', label: 'Converted' },
                  { value: 'closed', label: 'Closed' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Table list */}
        <Card title="Prospect Inquiries Ledger" description={`${filtered.length} prospective applicant records`}>
          <Table
            caption="Prospect Inquiries Ledger"
            hideCaption
            columns={columns}
            rows={filtered}
            getRowKey={(inq) => inq.id}
            empty={<div className="p-6 text-center text-xs text-ink-muted">No inquiries match your criteria.</div>}
          />
        </Card>
      </div>

      <NewInquiryDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateInquiry}
      />
    </PageContainer>
  )
}

function NewInquiryDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<AdmissionInquiry, 'id'>) => void
}) {
  const [childName, setChildName] = useState('')
  const [gradeApplied, setGradeApplied] = useState('1')
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [source, setSource] = useState<AdmissionInquiry['source']>('Walk-in')
  const [inquiryDate, setInquiryDate] = useState(new Date().toISOString().split('T')[0] ?? '2026-03-01')
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0] ?? '2026-03-05')
  const [counselorNotes, setCounselorNotes] = useState('')

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onSubmit({
      childName,
      gradeApplied: parseInt(gradeApplied, 10),
      parentName,
      parentPhone,
      parentEmail,
      source,
      inquiryDate,
      followUpDate,
      counselorNotes,
      status: 'new',
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title="Log Admission Inquiry"
      description="Record a walk-in, phone lead, or online inquiry from a prospective parent."
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Prospective Child Name"
            required
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />
          <Input
            label="Grade Applied For"
            type="number"
            min={1}
            max={12}
            required
            value={gradeApplied}
            onChange={(e) => setGradeApplied(e.target.value)}
          />
          <Input
            label="Parent / Guardian Name"
            required
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
          />
          <Input
            label="Contact Phone Number"
            required
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
          />
          <Select
            label="Lead Source"
            value={source}
            onValueChange={(val) => setSource(val as AdmissionInquiry['source'])}
            options={[
              { value: 'Walk-in', label: 'Walk-in at Reception' },
              { value: 'Phone Call', label: 'Phone Inquiry' },
              { value: 'Website Portal', label: 'School Website Portal' },
              { value: 'Referral', label: 'Parent / Staff Referral' },
              { value: 'Social Media', label: 'Social Media / Campaign' },
            ]}
          />
          <Input
            label="Inquiry Date"
            type="date"
            required
            value={inquiryDate}
            onChange={(e) => setInquiryDate(e.target.value)}
          />
          <Input
            label="Follow-up Due Date"
            type="date"
            required
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
          />
        </div>
        <Input
          label="Counselor Notes & Queries"
          value={counselorNotes}
          onChange={(e) => setCounselorNotes(e.target.value)}
          placeholder="Specific questions about syllabus, languages, bus routes..."
        />
        <div className="flex justify-end gap-2 pt-2 border-t border-line">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Inquiry
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
