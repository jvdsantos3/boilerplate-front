import { clearAuth, getAccessToken } from '@/lib/auth'
import { api, refreshAccessToken } from '@/lib/http'

/** Rotas de login/recuperação: visitantes não autenticados não precisam de /sessions/refresh. */
const AUTH_FLOW_PATH_PREFIXES = [
	'/sign-in',
	'/sign-in-link',
	'/forgot-password',
	'/reset-password',
] as const

function isAuthFlowPath(pathname: string): boolean {
	return AUTH_FLOW_PATH_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	)
}

export async function initAuthFromRefresh(opts: { pathname: string }) {
	if (getAccessToken()) return

	if (isAuthFlowPath(opts.pathname)) return

	try {
		await refreshAccessToken()
	} catch {
		// Sem cookie de refresh valido: permanece anonimo
	}
}

export async function logout() {
	try {
		await api.post('/sessions/logout')
	} catch {
		// Ainda limpamos estado local mesmo se a revogacao falhar na rede
	} finally {
		clearAuth()

		window.location.assign('/sign-in')
	}
}
