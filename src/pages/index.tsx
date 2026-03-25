import { createFileRoute, redirect } from '@tanstack/react-router'
import { getAccessToken } from '@/lib/auth'
import { logout } from '@/lib/auth-session'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
	beforeLoad: ({ location }) => {
		if (!getAccessToken()) {
			throw redirect({
				to: '/sign-in',
				search: {
					redirect: `${location.pathname}${location.search}`,
				},
			})
		}
	},
	component: HomePage,
})

function HomePage() {
	return (
		<div className="p-6">
			<div className="flex items-center justify-between gap-4">
				<h1 className="font-semibold text-2xl">Home</h1>
				<Button onClick={() => void logout()} type="button" variant="outline">
					Sair
				</Button>
			</div>
		</div>
	)
}
