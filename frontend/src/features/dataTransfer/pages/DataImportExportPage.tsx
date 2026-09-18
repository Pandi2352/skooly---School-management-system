import { useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileTextIcon,
} from '@phosphor-icons/react'
import { ExportCenterPanel } from '../components/ExportCenterPanel'
import { ImportWizard } from '../components/ImportWizard'
import { TemplateDownloadCard } from '../components/TemplateDownloadCard'

type ActiveTab = 'import' | 'export' | 'templates'

export function DataImportExportPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('import')

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <span>Core Setup & Administration</span>
          <span>/</span>
          <span className="text-ink">Data Import & Export</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">
          Data Import & Export Center
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Bulk onboard students, parents, and staff via CSV with custom mapping and validation, or export school ledgers to Excel and CSV.
        </p>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'import'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:border-border hover:text-ink'
          }`}
        >
          <ArrowUpIcon className="h-4 w-4" />
          Bulk CSV Import Wizard
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'export'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:border-border hover:text-ink'
          }`}
        >
          <ArrowDownIcon className="h-4 w-4" />
          Export Center
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted hover:border-border hover:text-ink'
          }`}
        >
          <FileTextIcon className="h-4 w-4" />
          Starter CSV Templates
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'import' && <ImportWizard />}
        {activeTab === 'export' && <ExportCenterPanel />}
        {activeTab === 'templates' && <TemplateDownloadCard />}
      </div>
    </div>
  )
}
