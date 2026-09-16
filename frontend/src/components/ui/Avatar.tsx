import { Avatar as RadixAvatar } from 'radix-ui'
import { cn } from '@/lib/cn'
import { getInitials } from '@/lib/getInitials'

type AvatarSize = 'sm' | 'md' | 'lg'

const sizes: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
}

type AvatarProps = {
  /** A real person's name; initials are shown until the photo loads, or if there is none. */
  name: string
  src?: string
  size?: AvatarSize
  className?: string
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <RadixAvatar.Root
      className={cn(
        'inline-flex flex-none items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-surface select-none',
        sizes[size],
        className,
      )}
    >
      {src && <RadixAvatar.Image src={src} alt={name} className="size-full object-cover" />}
      <RadixAvatar.Fallback delayMs={src ? 300 : 0}>
        <span aria-hidden="true">{getInitials(name)}</span>
        <span className="sr-only">{name}</span>
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
