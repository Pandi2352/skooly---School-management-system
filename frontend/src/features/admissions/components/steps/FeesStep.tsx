import { CheckIcon, CurrencyInrIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { SearchInput } from '@/components/ui/SearchInput'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useFeeGroups } from '../../hooks/useFeeGroups'
import type { AdmissionFormValues } from '../../types/admission.types'
import { addIds, filterFeeGroups, removeIds, toggleId } from '../../utils/feeGroups'

export function FeesStep() {
  const { control } = useFormContext<AdmissionFormValues>()
  const [query, setQuery] = useState('')
  const feeGroups = useFeeGroups()
  const all = feeGroups.data ?? []
  const visible = filterFeeGroups(all, query)
  const visibleIds = visible.map((group) => group.id)
  const filtered = query.trim() !== ''

  return (
    <section aria-labelledby="fees-heading" className="grid gap-4">
      <SectionHeading id="fees-heading" icon={CurrencyInrIcon}>
        Assign fee groups
      </SectionHeading>
      <p className="text-sm text-ink-muted">
        Choose the fee groups this student pays. None are required to admit.
      </p>

      <Controller
        control={control}
        name="fees.feeGroupIds"
        render={({ field }) => {
          const selected = field.value
          const allVisibleSelected =
            visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id))
          const noneVisibleSelected = visibleIds.every((id) => !selected.includes(id))

          return (
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="w-full @xl:w-72">
                  <SearchInput
                    label="Search fee groups"
                    placeholder="Search fee groups…"
                    value={query}
                    onValueChange={setQuery}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={allVisibleSelected}
                    onClick={() => field.onChange(addIds(selected, visibleIds))}
                  >
                    <CheckIcon className="size-4" weight="bold" aria-hidden="true" />
                    {filtered ? 'Select shown' : 'Select All'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={noneVisibleSelected}
                    onClick={() => field.onChange(removeIds(selected, visibleIds))}
                  >
                    <XIcon className="size-4" weight="bold" aria-hidden="true" />
                    {filtered ? 'Clear shown' : 'Clear All'}
                  </Button>
                </div>
              </div>

              {feeGroups.isPending ? (
                <p className="text-sm text-ink-muted">Loading fee groups…</p>
              ) : feeGroups.isError ? (
                <p role="alert" className="text-sm font-semibold text-danger">
                  Couldn’t load fee groups: {getErrorMessage(feeGroups.error)}
                </p>
              ) : visible.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  {all.length === 0
                    ? 'No fee groups have been set up yet.'
                    : `No fee group matches “${query.trim()}”.`}
                </p>
              ) : (
                <ul aria-label="Fee groups" className="grid gap-2 @2xl:grid-cols-2">
                  {visible.map((group) => {
                    const checked = selected.includes(group.id)
                    return (
                      <li
                        key={group.id}
                        className={cn(
                          'rounded-md border px-3 transition-colors motion-reduce:transition-none',
                          checked
                            ? 'border-primary bg-primary/5'
                            : 'border-line bg-canvas hover:border-primary/40',
                        )}
                      >
                        <Checkbox
                          label={<span className="font-semibold">{group.name}</span>}
                          checked={checked}
                          onCheckedChange={() => field.onChange(toggleId(selected, group.id))}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}

              <p className="text-sm text-ink-muted" aria-live="polite">
                {selected.length} of {all.length} fee groups selected
              </p>
            </div>
          )
        }}
      />
    </section>
  )
}
