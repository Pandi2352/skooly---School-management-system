import { COLOR_THEMES, isColorTheme, isThemePreference } from '@/app/theme/themeContext'
import { PageContainer } from '@/components/page/PageContainer'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { useTheme } from '@/hooks/useTheme'

const themeOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const SCHOOL_DEFAULT = 'school'

export function GeneralSettingsPage() {
  const { preference, setPreference, colorTheme, setColorTheme, schoolColorTheme, usesSchoolColorTheme, followSchoolColorTheme } =
    useTheme()
  const schoolLabel = COLOR_THEMES.find((option) => option.value === schoolColorTheme)?.label ?? 'Navy'
  const colorThemeOptions = [
    { value: SCHOOL_DEFAULT, label: `School default (${schoolLabel})` },
    ...COLOR_THEMES.map(({ value, label }) => ({ value, label })),
  ]

  return (
    <PageContainer title="General settings" description="These settings are saved in this browser.">
      <Card title="Appearance" className="max-w-xl">
        <div className="grid gap-4">
          <Select
            label="Theme"
            hint="System follows your device's light or dark setting."
            options={themeOptions}
            value={preference}
            onValueChange={(value) => {
              if (isThemePreference(value)) setPreference(value)
            }}
          />
          <Select
            label="Colour theme"
            hint="Changes buttons, links and headings. The sidebar stays navy. The school default is set on the Branding page."
            options={colorThemeOptions}
            value={usesSchoolColorTheme ? SCHOOL_DEFAULT : colorTheme}
            onValueChange={(value) => {
              if (value === SCHOOL_DEFAULT) followSchoolColorTheme()
              else if (isColorTheme(value)) setColorTheme(value)
            }}
          />
        </div>
      </Card>
    </PageContainer>
  )
}
