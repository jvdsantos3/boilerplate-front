import axios, { type AxiosError, isAxiosError } from 'axios'
import { clearAuth, getAccessToken, setAccessToken } from '@/lib/auth'

function requireApiUrl(): string {
	const base = import.meta.env.VITE_API_URL

	if (typeof base !== 'string' || base.length === 0) {
		throw new Error('VITE_API_URL is not set')
	}

	return base.replace(/\/$/, '')
}

export const api = axios.create({
	baseURL: requireApiUrl(),
	withCredentials: true,
})

function requestPath(config: { baseURL?: string; url?: string }): string {
	const url = config.url ?? ''
	if (url.startsWith('http')) {
		try {
			return new URL(url).pathname
		} catch {
			return url
		}
	}

	return url.startsWith('/') ? url : `/${url}`
}

function shouldSkipAuthRefreshOn401(config: {
	baseURL?: string
	url?: string
	method?: string
}): boolean {
	const path = requestPath(config)
	const method = (config.method ?? 'get').toLowerCase()

	if (path === '/sessions/refresh') return true

	if (path === '/password/forgot') return true
	if (path === '/password/reset') return true

	if (path === '/sessions/magic-link') return true
	if (path === '/sessions/magic-link/verify') return true

	if (path === '/sessions/mfa/verify') return true
	if (path === '/sessions/mfa/resend') return true

	if (method === 'post' && path === '/sessions') return true

	return false
}

let refreshInFlight: Promise<void> | null = null

export function refreshAccessToken(): Promise<void> {
	if (!refreshInFlight) {
		refreshInFlight = api
			.post<{ accessToken: string }>('/sessions/refresh')
			.then((r) => {
				setAccessToken(r.data.accessToken)
			})
			.finally(() => {
				refreshInFlight = null
			})
	}

	return refreshInFlight
}

api.interceptors.request.use((config) => {
	const token = getAccessToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

api.interceptors.response.use(
	(r) => r,
	async (error: AxiosError) => {
		const original = error.config
		if (
			error.response?.status !== 401 ||
			!original ||
			original._authRetry ||
			shouldSkipAuthRefreshOn401(original)
		) {
			return Promise.reject(error)
		}

		original._authRetry = true
		try {
			await refreshAccessToken()
		} catch {
			clearAuth()
			window.location.assign('/sign-in')
			return Promise.reject(error)
		}

		const token = getAccessToken()
		if (!token) {
			clearAuth()
			window.location.assign('/sign-in')
			return Promise.reject(error)
		}

		original.headers.Authorization = `Bearer ${token}`

		return api.request(original)
	},
)

export function getApiErrorMessage(error: unknown): string {
	if (!isAxiosError(error)) {
		return error instanceof Error ? error.message : 'Erro inesperado.'
	}

	const data = error.response?.data as Record<string, unknown> | undefined
	const rawMessage = data?.message
	const rawErrors = (data as Record<string, unknown> | undefined)?.errors

	if (typeof rawMessage === 'string' && rawMessage.length > 0) return rawMessage

	if (Array.isArray(rawErrors)) {
		const errorMessages = rawErrors
			.map((e) => {
				if (typeof e === 'string') return e
				if (!e || typeof e !== 'object') return null
				const maybeMessage = (e as { message?: unknown }).message
				return typeof maybeMessage === 'string' ? maybeMessage : null
			})
			.filter((m): m is string => Boolean(m))

		if (errorMessages.length > 0) return errorMessages.join(', ')
	}

	if (Array.isArray(rawMessage)) return rawMessage.join(', ')

	if (error.response?.status === 429) {
		return 'Muitas tentativas. Tente novamente em instantes.'
	}

	return 'Não foi possível completar a solicitação.'
}
