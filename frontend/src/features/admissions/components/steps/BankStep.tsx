import { BankIcon } from '@phosphor-icons/react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { AdmissionFormValues } from '../../types/admission.types'

export function BankStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const fieldErrors = errors.bank

  return (
    <section aria-labelledby="bank-heading" className="grid gap-4">
      <SectionHeading id="bank-heading" icon={BankIcon}>
        Bank details
      </SectionHeading>
      <p className="text-sm text-ink-muted">
        Optional, for scholarships and refunds. Once you start, fill in the account holder, account
        number and IFSC.
      </p>
      <div className="grid gap-x-4 gap-y-3.5 @xl:grid-cols-2">
        <Input
          label="Account Holder Name"
          autoComplete="off"
          placeholder="Name as on the bank account"
          error={fieldErrors?.accountHolder?.message}
          {...register('bank.accountHolder')}
        />
        <Input
          label="Bank Name"
          autoComplete="off"
          placeholder="e.g. State Bank of India"
          error={fieldErrors?.bankName?.message}
          {...register('bank.bankName')}
        />
        <Input
          label="Account Number"
          inputMode="numeric"
          autoComplete="off"
          placeholder="9 to 18 digits"
          error={fieldErrors?.accountNumber?.message}
          {...register('bank.accountNumber')}
        />
        <Input
          label="IFSC"
          autoComplete="off"
          placeholder="e.g. SBIN0001234"
          className="uppercase placeholder:normal-case"
          error={fieldErrors?.ifsc?.message}
          {...register('bank.ifsc')}
        />
      </div>
    </section>
  )
}
