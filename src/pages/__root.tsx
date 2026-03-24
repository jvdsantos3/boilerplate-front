import { createRootRoute, Outlet } from '@tanstack/react-router'

function RootError({ error }: { error: Error }) {
	return (
		<div className="space-y-2">
			<h2 className="text-lg font-semibold">Algo deu errado</h2>
			<p className="text-muted-foreground text-sm">{error.message}</p>
		</div>
	)
}

function RootPending() {
	return <div className="text-muted-foreground text-sm">Carregando...</div>
}

export const Route = createRootRoute({
	component: RootComponent,
	errorComponent: RootError,
	pendingComponent: RootPending,
})

function RootComponent() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Outlet />
		</div>
	)
}
