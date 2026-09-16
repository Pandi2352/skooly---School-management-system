import {
  CaretDownIcon,
  FilesIcon,
  ImagesIcon,
  KeyIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  UploadSimpleIcon,
  type Icon,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { Dropdown, DropdownItem, DropdownLabel } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'

type PlannedTool = { label: string; icon: Icon; description: string }

const plannedTools: PlannedTool[] = [
  {
    label: 'Bulk Upload',
    icon: UploadSimpleIcon,
    description: 'Admit many students at once from a spreadsheet.',
  },
  {
    label: 'Bulk Photos',
    icon: ImagesIcon,
    description: 'Upload student photos in one go, matched by admission number.',
  },
  {
    label: 'Bulk Docs',
    icon: FilesIcon,
    description: 'Attach documents such as birth certificates to many students.',
  },
  {
    label: 'Credentials',
    icon: KeyIcon,
    description: 'Create and share app logins for students and parents.',
  },
]

// Page-level tools laid out like the reference. Only "Admit Student" has a page today (the admission
// form). The others aren't built: hovering says "Coming soon", and clicking explains what the tool
// will do, so no button silently does nothing (antislop R-26).
export function StudentListActions() {
  const { toast } = useToast()

  const announce = (tool: Pick<PlannedTool, 'label' | 'description'>) => {
    toast({ title: `${tool.label} is coming soon`, description: tool.description })
  }

  return (
    <>
      <Link to={paths.studentNew} className={buttonClasses()}>
        <PlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
        Admit Student
      </Link>

      {plannedTools.map((tool) => (
        <Tooltip key={tool.label} content="Coming soon">
          <Button variant="secondary" onClick={() => announce(tool)}>
            <tool.icon className="size-4.5" aria-hidden="true" />
            {tool.label}
          </Button>
        </Tooltip>
      ))}

      <Dropdown
        trigger={
          <Button variant="secondary">
            <SlidersHorizontalIcon className="size-4.5" aria-hidden="true" />
            Customize Form
            <CaretDownIcon className="size-4" aria-hidden="true" />
          </Button>
        }
      >
        {/* TODO(api): enable once admission form settings exist. */}
        <DropdownLabel>Coming soon</DropdownLabel>
        <DropdownItem disabled>Admission form fields</DropdownItem>
        <DropdownItem disabled>Required documents</DropdownItem>
        <DropdownItem disabled>Student profile fields</DropdownItem>
      </Dropdown>
    </>
  )
}
