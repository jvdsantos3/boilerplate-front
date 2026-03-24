import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	const isDark = theme === 'dark'

	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
		>
			{isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
		</Button>
	)
}
