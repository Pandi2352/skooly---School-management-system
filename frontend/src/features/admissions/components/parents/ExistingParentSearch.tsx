import { MagnifyingGlassIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useParentAccounts } from '../../hooks/useParentAccounts'
import type { AdmissionFormValues } from '../../types/admission.types'
import { filterParentAccounts } from '../../utils/admissionRequest'

/** Find a parent the school already has and link the new student to their account. */
export function ExistingParentSearch() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const [query, setQuery] = useState('')
  const accounts = useParentAccounts()
  const matches = filterParentAccounts(accounts.data ?? [], query).slice(0, 8)

  return (
    <Controller
      control={control}
      name="parents.existingParentId"
      render={({ field }) => {
        const selected = accounts.data?.find((account) => account.id === field.value)

        if (selected) {
          return (
            <div className="flex flex-wrap items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-4">
              <UsersThreeIcon
                className="mt-0.5 size-5 flex-none text-primary"
                weight="fill"
                aria-hidden="true"
              />
              <div className="grid min-w-0 flex-1 gap-0.5">
                <p className="text-sm text-ink-muted">Linked parent account</p>
                <p className="font-semibold text-ink">{selected.name}</p>
                <p className="text-sm text-ink-muted">
                  {selected.phone} · {selected.email}
                </p>
                {selected.children.length > 0 && (
                  <p className="text-sm text-ink-muted">Parent of {selected.children.join(', ')}</p>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={() => field.onChange('')}>
                Change
              </Button>
            </div>
          )
        }

        const trimmed = query.trim()
        return (
          <div className="grid gap-3 rounded-md border border-line bg-canvas p-4">
            <Input
              type="search"
              label="Search Existing Parent"
              required
              autoComplete="off"
              startIcon={MagnifyingGlassIcon}
              placeholder="Search by parent’s name, email or phone"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              error={errors.parents?.existingParentId?.message}
            />
            {accounts.isPending ? (
              <p className="text-sm text-ink-muted">Loading parent accounts…</p>
            ) : accounts.isError ? (
              <p role="alert" className="text-sm font-semibold text-danger">
                Couldn’t load parent accounts. Reload the page to try again.
              </p>
            ) : trimmed.length < 2 ? (
              <p className="text-sm text-ink-muted">
                Type at least 2 characters to see matching parents.
              </p>
            ) : matches.length === 0 ? (
              <p className="text-sm text-ink-muted" aria-live="polite">
                No parent account matches “{trimmed}”. Check the spelling, or create a new parent
                account.
              </p>
            ) : (
              <ul aria-label="Matching parents" className="grid gap-1.5">
                {matches.map((account) => (
                  <li key={account.id}>
                    <button
                      type="button"
                      onClick={() => field.onChange(account.id)}
                      className="grid w-full cursor-pointer gap-0.5 rounded-md border border-line bg-surface px-3 py-2 text-start hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span className="text-sm font-semibold text-ink">{account.name}</span>
                      <span className="text-sm text-ink-muted">
                        {account.phone} · {account.email}
                        {account.children.length > 0 &&
                          ` · Parent of ${account.children.join(', ')}`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      }}
    />
  )
}
