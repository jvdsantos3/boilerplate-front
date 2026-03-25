import { createRootRoute, Outlet } from '@tanstack/react-router'
import { initAuthFromRefresh } from '@/lib/auth-session'

export const Route = createRootRoute({
	beforeLoad: async ({ location }) => {
		await initAuthFromRefresh({ pathname: location.pathname })
	},
	component: RootComponent,
})

function RootComponent() {
	return (
		<div>
			<Outlet />
		</div>
	)
}
