import {
  CaretDownIcon,
  QuestionIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  TextboxIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'

type AdmissionPageActionsProps = {
  onFillMock?: (preset: 1 | 2) => void
}

export function AdmissionPageActions({ onFillMock }: AdmissionPageActionsProps = {}) {
  const { toast } = useToast()
  const navigate = useNavigate()

  return (
    <>
      <Dropdown
        trigger={
          <Button variant="secondary">
            <SparkleIcon className="size-4.5 text-primary" weight="fill" aria-hidden="true" />
            Fill Mock Data
            <CaretDownIcon className="size-4" aria-hidden="true" />
          </Button>
        }
      >
        <DropdownLabel>Fill test admission</DropdownLabel>
        <DropdownItem
          icon={SparkleIcon}
          onSelect={() => onFillMock?.(1)}
        >
          Preset 1: Rohan Verma (Class 5 Boy · Photo)
        </DropdownItem>
        <DropdownItem
          icon={SparkleIcon}
          onSelect={() => onFillMock?.(2)}
        >
          Preset 2: Ananya Sharma (Class 8 Girl · Photo)
        </DropdownItem>
      </Dropdown>
      <Dropdown
        trigger={
          <Button variant="secondary">
            <SlidersHorizontalIcon className="size-4.5" aria-hidden="true" />
            Customize Form
            <CaretDownIcon className="size-4" aria-hidden="true" />
          </Button>
        }
      >
        <DropdownLabel>Form settings</DropdownLabel>
        <DropdownItem
          icon={TextboxIcon}
          onSelect={() => {
            void navigate(paths.settingsCustomFields)
          }}
        >
          Custom fields
        </DropdownItem>
        <DropdownSeparator />
        {/* TODO(api): enable once required-document settings exist. */}
        <DropdownLabel>Coming soon</DropdownLabel>
        <DropdownItem disabled>Required documents</DropdownItem>
      </Dropdown>

      <Dialog
        title="How to admit a student"
        trigger={
          <Button variant="secondary">
            <QuestionIcon className="size-4.5" aria-hidden="true" />
            How to Guide
          </Button>
        }
      >
        <ol className="grid list-decimal gap-2 ps-5 text-sm text-ink">
          <li>
            <strong>Academic:</strong> admission number, roll number, class and section. Auto fills
            the next number in the format set in School Settings → System & Formats.
          </li>
          <li>
            <strong>Personal Info:</strong> the student’s first name, gender and date of birth are
            required. Add a photo by uploading one or taking it with the webcam.
          </li>
          <li>
            <strong>Parents:</strong> link to a parent account the school already has, or create a
            new one: choose the primary guardian, fill in their name and phone number, then the
            emergency contact and addresses.
          </li>
          <li>
            <strong>Health:</strong> optional medical conditions, allergies, height and weight.
          </li>
          <li>
            <strong>Bank:</strong> optional. Once started, it needs the account holder, account
            number and IFSC.
          </li>
          <li>
            <strong>Fees:</strong> tick the fee groups this student pays.
          </li>
          <li>
            <strong>Documents:</strong> answer any additional details your school has added
            (Customize Form → Custom fields), add a row for each document, then press Admit Student.
          </li>
        </ol>
        <p className="mt-3 text-sm text-ink-muted">
          Next Step checks the current step before moving on. You can also open any step from the
          step list; Submit checks every step and takes you to anything missing.
        </p>
      </Dialog>

      <Tooltip content="Coming soon">
        <Button
          onClick={() =>
            toast({
              title: 'Bulk Upload is coming soon',
              description: 'Admit many students at once from a spreadsheet.',
            })
          }
        >
          <UploadSimpleIcon className="size-4.5" aria-hidden="true" />
          Bulk Upload
        </Button>
      </Tooltip>
    </>
  )
}
