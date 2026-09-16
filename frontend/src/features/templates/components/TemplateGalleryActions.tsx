import { CaretDownIcon, FilePlusIcon, MagicWandIcon } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { Dropdown, DropdownItem, DropdownLabel } from '@/components/ui/Dropdown'
import { CARD_SIZES } from '../constants'

export function TemplateGalleryActions() {
  const navigate = useNavigate()

  return (
    <>
      <Dropdown
        align="end"
        trigger={
          <Button variant="secondary">
            <FilePlusIcon className="size-4.5" aria-hidden="true" />
            Start from Scratch
            <CaretDownIcon className="size-4" aria-hidden="true" />
          </Button>
        }
      >
        <DropdownLabel>Choose a size (mm)</DropdownLabel>
        {CARD_SIZES.map((size) => (
          <DropdownItem
            key={size.id}
            onSelect={() => {
              void navigate(paths.canvasDesignerBlank(size.id))
            }}
          >
            {size.label}
          </DropdownItem>
        ))}
      </Dropdown>
      <Link to={paths.canvasDesigner()} className={buttonClasses()}>
        <MagicWandIcon className="size-4.5" weight="fill" aria-hidden="true" />
        Canvas Designer
      </Link>
    </>
  )
}
