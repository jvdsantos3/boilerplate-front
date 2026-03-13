import { Outlet, createRootRoute } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/ui/theme-toggle'

function RootError({ error }: { error: Error }) {
	return (
		<div className="space-y-2">
			<h2 className="text-lg font-semibold">Algo deu errado</h2>
			<p className="text-sm text-muted-foreground">{error.message}</p>
		</div>
	)
}

function RootPending() {
	return <div className="text-sm text-muted-foreground">Carregando...</div>
}

export const Route = createRootRoute({
	component: RootComponent,
	errorComponent: RootError,
	pendingComponent: RootPending,
})

function RootComponent() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="flex items-center justify-between px-4 py-3 border-b">
				<h1 className="text-lg font-semibold">Boilerplate</h1>
				<ThemeToggle />
			</header>
			<main className="px-4 py-6">
				<Outlet />
			</main>
		</div>
	)
}
