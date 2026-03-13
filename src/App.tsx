import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'
import { routeTree } from './route-tree.gen'

const router = createRouter({ routeTree })

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster position="top-right" />
		</QueryClientProvider>
	)
}
