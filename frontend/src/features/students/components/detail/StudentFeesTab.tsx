import { ReceiptIcon } from '@phosphor-icons/react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Table, type TableColumn } from '@/components/ui/Table'
import { formatDate, formatMoney } from '@/lib/format'
import type { StudentDetail, StudentInvoice } from '../../types/student.types'

const invoiceStatusLabels = {
  paid: 'Paid',
  due: 'Pending',
  overdue: 'Overdue',
}

const invoiceStatusTones: Record<'paid' | 'due' | 'overdue', BadgeTone> = {
  paid: 'neutral',
  due: 'planned',
  overdue: 'danger',
}

const columns: TableColumn<StudentInvoice>[] = [
  {
    key: 'invoiceNo',
    header: 'Invoice no.',
    cell: (inv) => <span className="font-mono text-xs text-ink tabular-nums">{inv.invoiceNo}</span>,
  },
  {
    key: 'title',
    header: 'Fee description',
    cell: (inv) => <span className="font-medium text-ink">{inv.title}</span>,
  },
  {
    key: 'dueDate',
    header: 'Due date',
    cell: (inv) => <span className="text-ink-muted tabular-nums">{formatDate(inv.dueDate)}</span>,
  },
  {
    key: 'amount',
    header: 'Total amount',
    cell: (inv) => (
      <span className="font-semibold text-ink tabular-nums">{formatMoney(inv.amountPaise)}</span>
    ),
  },
  {
    key: 'paid',
    header: 'Paid',
    cell: (inv) => (
      <span className="text-ink-muted tabular-nums">{formatMoney(inv.paidPaise)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (inv) => (
      <Badge tone={invoiceStatusTones[inv.status]}>{invoiceStatusLabels[inv.status]}</Badge>
    ),
  },
  {
    key: 'action',
    header: 'Receipt',
    align: 'end',
    cell: (inv) => (
      <Button
        variant="ghost"
        size="sm"
        disabled={inv.status !== 'paid'}
        title={
          inv.status === 'paid' ? 'Print payment receipt' : 'Receipt available once fee is cleared'
        }
        onClick={() => window.print()}
      >
        <ReceiptIcon className="mr-1 size-4" aria-hidden="true" />
        Receipt
      </Button>
    ),
  },
]

export function StudentFeesTab({ student }: { student: StudentDetail }) {
  const { feeSummary, invoices } = student

  return (
    <div className="grid gap-6">
      {/* Financial Overview KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-4 shadow-2xs">
          <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">
            Total Billed
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-ink tabular-nums">
            {formatMoney(feeSummary.totalBilledPaise)}
          </div>
          <span className="mt-1 block text-xs text-ink-muted">Academic Year 2026–2027</span>
        </div>

        <div className="rounded-lg border border-line bg-surface p-4 shadow-2xs">
          <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">
            Total Received
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-ink tabular-nums">
            {formatMoney(feeSummary.totalPaidPaise)}
          </div>
          <span className="mt-1 block text-xs text-ink-muted">Recorded counter payments</span>
        </div>

        <div className="rounded-lg border border-line bg-surface p-4 shadow-2xs">
          <span className="text-xs font-medium tracking-wider text-ink-muted uppercase">
            Current Balance Due
          </span>
          <div
            className={`mt-1 text-xl font-bold tracking-tight tabular-nums ${
              feeSummary.balanceDuePaise > 0 ? 'text-danger' : 'text-ink'
            }`}
          >
            {formatMoney(feeSummary.balanceDuePaise)}
          </div>
          <span className="mt-1 block text-xs text-ink-muted">
            {feeSummary.balanceDuePaise > 0
              ? 'Outstanding balance pending payment'
              : 'All scheduled fees are up to date'}
          </span>
        </div>
      </div>

      {/* Invoices List */}
      <Card
        title="Fee Invoices & Term Breakdown"
        description="Term-wise schedule of tuition, laboratory, and institutional charges."
      >
        <Table
          caption="Fee invoices"
          hideCaption
          bordered={false}
          columns={columns}
          primaryKey="title"
          rows={invoices}
          getRowKey={(inv) => inv.id}
          isLoading={false}
          empty="No fee invoices generated yet."
        />
      </Card>
    </div>
  )
}
