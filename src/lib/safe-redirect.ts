/** Evita open redirect: apenas paths relativos ao mesmo origin. */
export function safeInternalPath(redirect: string | undefined): string {
	if (!redirect?.startsWith('/') || redirect.startsWith('//')) {
		return '/'
	}
	return redirect
}
