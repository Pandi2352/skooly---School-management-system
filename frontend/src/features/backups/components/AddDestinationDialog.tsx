import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from '@phosphor-icons/react'
import { useId } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { CHANNEL_OPTIONS } from '../constants'
import { useAddDestination } from '../hooks/useDestinations'
import { destinationFormSchema } from '../schemas/backup.schema'
import type { DestinationFormValues } from '../types/backup.types'
import { toDestinationInput } from '../utils/backupFormat'

const emptyValues: DestinationFormValues = {
  channel: 'telegram',
  label: '',
  botToken: '',
  chatId: '',
  email: '',
}

type AddDestinationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDestinationDialog({ open, onOpenChange }: AddDestinationDialogProps) {
  const formId = useId()
  const { toast } = useToast()
  const addDestination = useAddDestination()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: emptyValues,
  })
  const channel = useWatch({ control, name: 'channel' })

  const changeOpen = (next: boolean) => {
    if (!next) reset(emptyValues)
    onOpenChange(next)
  }

  const submit = handleSubmit(async (values) => {
    try {
      const saved = await addDestination.mutateAsync(toDestinationInput(values))
      toast({
        title: 'Destination added',
        description: `${saved.label} will receive a copy of each backup. Sample data: it resets when the page reloads.`,
      })
      changeOpen(false)
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t add the destination',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={changeOpen}
      title="Add destination"
      description="Choose where a copy of each backup is sent."
      footer={
        <>
          <Button variant="secondary" disabled={isSubmitting} onClick={() => changeOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={isSubmitting}>
            {!isSubmitting && <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />}
            Add destination
          </Button>
        </>
      }
    >
      <form id={formId} noValidate className="grid gap-4" onSubmit={(event) => void submit(event)}>
        <Controller
          control={control}
          name="channel"
          render={({ field }) => (
            <RadioGroup
              label="Channel"
              orientation="horizontal"
              options={CHANNEL_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <Input
          label="Name"
          required
          autoComplete="off"
          placeholder={channel === 'telegram' ? 'e.g. Principal’s Telegram' : 'e.g. Office email'}
          error={errors.label?.message}
          {...register('label')}
        />
        {channel === 'telegram' ? (
          <>
            <Input
              label="Bot Token"
              type="password"
              required
              autoComplete="off"
              spellCheck={false}
              hint="Create a bot with @BotFather in Telegram and paste the token it gives you."
              error={errors.botToken?.message}
              {...register('botToken')}
            />
            <Input
              label="Chat ID"
              required
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. -1001234567890"
              hint="The chat or channel that receives backups. Add the bot to it first."
              error={errors.chatId?.message}
              {...register('chatId')}
            />
          </>
        ) : (
          <Input
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. admin@yourschool.in"
            error={errors.email?.message}
            {...register('email')}
          />
        )}
      </form>
    </Dialog>
  )
}
