import { PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { PageContainer } from '@/components/page/PageContainer'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { CustomFieldForm } from '../components/CustomFieldForm'
import { CustomFieldsTable } from '../components/CustomFieldsTable'
import type { CustomField } from '../types/customField.types'

export function CustomFieldsPage() {
  // 'new' while adding, the field while editing, null when the dialog is closed.
  const [editing, setEditing] = useState<CustomField | 'new' | null>(null)

  return (
    <PageContainer
      title="Custom Fields"
      description="Extra questions your school asks on the student admission form."
      actions={
        <Button onClick={() => setEditing('new')}>
          <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
          Add Field
        </Button>
      }
      fullWidth
    >
      <div className="grid min-w-0 grid-cols-1 gap-4">
        <Alert title="Where these appear">
          Fields marked Shown appear, in this order, under Additional details on the Documents step
          of{' '}
          <Link
            to={paths.studentNew}
            className="font-semibold text-primary underline underline-offset-2"
          >
            Student Admission
          </Link>
          .
        </Alert>
        <CustomFieldsTable onAdd={() => setEditing('new')} onEdit={setEditing} />
      </div>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        title={editing === 'new' ? 'Add custom field' : 'Edit custom field'}
      >
        {editing !== null && (
          <CustomFieldForm
            field={editing === 'new' ? null : editing}
            onDone={() => setEditing(null)}
          />
        )}
      </Dialog>
    </PageContainer>
  )
}
