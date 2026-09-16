import type { ReactNode } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { PADDING_OPTIONS, PREFIX_MAX_LENGTH, SEPARATOR_OPTIONS } from '../constants'
import type { DatedSequenceName, SequenceName, SystemSettings } from '../types/settings.types'
import { dateFormatOptions, sessionFormatOptions } from '../utils/sequenceFormat'

type SequenceFieldsProps = {
  name: SequenceName
  prefixLabel: string
  prefixHint?: string
  prefixPlaceholder: string
  today: Date
  /** Extra fields in the same grid, such as `DatedSequenceFields`. */
  children?: ReactNode
}

/** Prefix, separator, padding and session fields shared by every numbering section. */
export function SequenceFields({
  name,
  prefixLabel,
  prefixHint,
  prefixPlaceholder,
  today,
  children,
}: SequenceFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SystemSettings>()
  const includeSession = useWatch({ control, name: `${name}.includeSession` })

  return (
    <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2">
        <Input
          label={prefixLabel}
          hint={prefixHint}
          placeholder={prefixPlaceholder}
          maxLength={PREFIX_MAX_LENGTH}
          autoComplete="off"
          error={errors[name]?.prefix?.message}
          {...register(`${name}.prefix`)}
        />
      </div>
      <Controller
        control={control}
        name={`${name}.separator`}
        render={({ field }) => (
          <Select
            label="Separator"
            options={SEPARATOR_OPTIONS}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name={`${name}.padding`}
        render={({ field }) => (
          <Select
            label="Number Padding"
            options={PADDING_OPTIONS}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name={`${name}.includeSession`}
        render={({ field }) => (
          <Switch
            variant="field"
            label="Include Academic Session"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name={`${name}.sessionFormat`}
        render={({ field }) => (
          <Select
            label="Session Format"
            options={sessionFormatOptions(today)}
            value={field.value}
            onValueChange={field.onChange}
            disabled={!includeSession}
          />
        )}
      />
      {children}
    </div>
  )
}

type DatedSequenceFieldsProps = {
  name: DatedSequenceName
  dateLabel: string
  nextLabel: string
  nextHint: string
  today: Date
}

/** Date and counter fields for sequences that have them; render inside `SequenceFields`. */
export function DatedSequenceFields({
  name,
  dateLabel,
  nextLabel,
  nextHint,
  today,
}: DatedSequenceFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SystemSettings>()
  const includeDate = useWatch({ control, name: `${name}.includeDate` })

  return (
    <>
      <Controller
        control={control}
        name={`${name}.includeDate`}
        render={({ field }) => (
          <Switch
            variant="field"
            label={dateLabel}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name={`${name}.dateFormat`}
        render={({ field }) => (
          <Select
            label="Date Format"
            options={dateFormatOptions(today)}
            value={field.value}
            onValueChange={field.onChange}
            disabled={!includeDate}
          />
        )}
      />
      <div className="sm:col-start-1">
        <Input
          label={nextLabel}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          required
          hint={nextHint}
          error={errors[name]?.nextNumber?.message}
          {...register(`${name}.nextNumber`, { valueAsNumber: true })}
        />
      </div>
    </>
  )
}
