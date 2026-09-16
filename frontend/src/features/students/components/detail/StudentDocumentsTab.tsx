import { DownloadSimpleIcon, FilePdfIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/format'
import type { DocumentType, StudentDetail } from '../../types/student.types'

const documentTypeLabels: Record<DocumentType, string> = {
  birth_certificate: 'Birth Certificate',
  transfer_certificate: 'Transfer Certificate',
  marksheet: 'Previous Marksheet',
  medical_record: 'Medical Report',
  id_proof: 'Government ID',
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function StudentDocumentsTab({ student }: { student: StudentDetail }) {
  const { documents } = student

  return (
    <div className="grid gap-6">
      <Card
        title="Student Document Vault"
        description="Verified institutional files, certificates, and identity documents."
        actions={
          <Button
            variant="secondary"
            size="sm"
            disabled
            title="Document upload modal planned in next update"
            aria-label="Upload New Document (Coming soon)"
          >
            <UploadSimpleIcon className="mr-1.5 size-4" aria-hidden="true" />
            Upload Document
          </Button>
        }
      >
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-start justify-between gap-3 rounded-md border border-line bg-surface p-4 shadow-2xs transition-colors hover:border-control"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-10 flex-none items-center justify-center rounded-md border border-line bg-canvas text-danger">
                    <FilePdfIcon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="grid min-w-0 gap-1">
                    <span className="truncate text-sm leading-tight font-semibold text-ink">
                      {doc.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                      <Badge tone="neutral">{documentTypeLabels[doc.type]}</Badge>
                      <span>•</span>
                      <span className="tabular-nums">{formatBytes(doc.fileSizeBytes)}</span>
                      <span>•</span>
                      <span className="tabular-nums">{formatDate(doc.uploadDate)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Download ${doc.title}`}
                  onClick={() => alert(`Downloading "${doc.title}"`)}
                >
                  <DownloadSimpleIcon className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-line p-8 text-center text-xs text-ink-muted">
            No official documents have been uploaded for this student yet.
          </div>
        )}
      </Card>
    </div>
  )
}
