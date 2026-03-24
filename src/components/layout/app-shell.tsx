import { Outlet } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function AppShell() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="flex items-center justify-between border-b px-4 py-3">
				<h1 className="font-semibold text-lg">Boilerplate</h1>
				<ThemeToggle />
			</header>
			<main className="px-4 py-6">
				<Outlet />
			</main>
		</div>
	)
}
