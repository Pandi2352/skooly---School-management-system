import {
  BellIcon,
  CaretDownIcon,
  CheckCircleIcon,
  ClockIcon,
  InfoIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'

type NotificationItem = {
  id: string
  title: string
  detail: string
  time: string
  tone: 'alert' | 'info' | 'success'
  route: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Fee Collection Due',
    detail: 'Term 1 tuition fees overdue for 18 students.',
    time: '15m ago',
    tone: 'alert',
    route: '/fees-finance/fee-collection',
  },
  {
    id: 'notif-2',
    title: 'Admission Inquiries',
    detail: '3 online admission applications pending verification.',
    time: '1h ago',
    tone: 'info',
    route: '/students/admission',
  },
  {
    id: 'notif-3',
    title: 'Attendance Submitted',
    detail: 'Daily attendance submitted for Class 10-A.',
    time: '2h ago',
    tone: 'success',
    route: '/students/student-attendance',
  },
  {
    id: 'notif-4',
    title: 'Exam Timetable',
    detail: 'CBSE annual examination timetable draft updated.',
    time: 'Yesterday',
    tone: 'info',
    route: '/academic-management/online-exams',
  },
]

export function NotificationsMenu() {
  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [unreadCount, setUnreadCount] = useState<number>(4)
  const { toast } = useToast()
  const navigate = useNavigate()

  const markAllRead = () => {
    setUnreadCount(0)
    toast({
      title: 'Notifications marked as read',
      description: 'All pending alerts have been cleared.',
    })
  }

  const getToneIcon = (tone: NotificationItem['tone']) => {
    switch (tone) {
      case 'alert':
        return <WarningCircleIcon className="size-4.5 flex-none text-accent" aria-hidden="true" />
      case 'success':
        return (
          <CheckCircleIcon
            className="text-emerald-600 dark:text-emerald-400 size-4.5 flex-none"
            aria-hidden="true"
          />
        )
      case 'info':
      default:
        return <InfoIcon className="size-4.5 flex-none text-primary" aria-hidden="true" />
    }
  }

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className="relative flex h-9 items-center gap-1 rounded-md px-2 text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-11"
          aria-label={unreadCount > 0 ? `Notifications: ${unreadCount} unread` : 'Notifications'}
        >
          <Tooltip
            content={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
          >
            <span className="flex items-center gap-1">
              <BellIcon className="size-5 text-ink-muted" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[11px] leading-none font-bold text-canvas">
                  {unreadCount}
                </span>
              )}
              <CaretDownIcon className="size-3 text-ink-muted" aria-hidden="true" />
            </span>
          </Tooltip>
        </button>
      }
    >
      <div className="flex items-center justify-between px-3 py-2">
        <DropdownLabel>
          <span className="font-semibold text-ink">Notifications</span>
        </DropdownLabel>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Mark all read
          </button>
        )}
      </div>
      <DropdownSeparator />
      <div className="max-h-80 max-w-sm overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-ink-muted">
            No unread notifications
          </div>
        ) : (
          notifications.map((item) => (
            <DropdownItem
              key={item.id}
              onSelect={() => {
                void navigate(item.route)
              }}
            >
              <div className="flex items-start gap-2.5 py-1">
                {getToneIcon(item.tone)}
                <div className="flex flex-col gap-0.5 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-ink">{item.title}</span>
                    <span className="flex-none text-[10px] text-ink-muted">{item.time}</span>
                  </div>
                  <span className="line-clamp-2 text-xs text-ink-muted">{item.detail}</span>
                </div>
              </div>
            </DropdownItem>
          ))
        )}
      </div>
      <DropdownSeparator />
      <DropdownItem
        icon={ClockIcon}
        onSelect={() => {
          void navigate('/communication/notice-board')
        }}
      >
        <span className="text-xs font-medium">View all in Notice Board</span>
      </DropdownItem>
    </Dropdown>
  )
}
