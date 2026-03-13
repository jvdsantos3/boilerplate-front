import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			console.error('Query error:', error)
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			console.error('Mutation error:', error)
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 min
			gcTime: 1000 * 60 * 10, // 10 min
			retry: 2,
			retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: true,
		},
		mutations: {
			retry: 1,
			onError: (error) => {
				console.error('Mutation error:', error)
			},
		},
	},
})
