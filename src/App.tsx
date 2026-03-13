import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'
import { routeTree } from './route-tree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<RouterProvider router={router} />
				<Toaster position="top-right" />
			</ThemeProvider>
		</QueryClientProvider>
	)
}
