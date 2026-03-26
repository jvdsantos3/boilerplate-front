import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from '@tanstack/react-router'
import { type FormEvent, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAccessToken, setAccessToken } from '@/lib/auth'
import { api, getApiErrorMessage } from '@/lib/http'
import { safeInternalPath } from '@/lib/safe-redirect'

type SignInLinkSearch = { token?: string; redirect?: string }

export const Route = createFileRoute('/sign-in-link')({
	validateSearch: (raw: Record<string, unknown>): SignInLinkSearch => ({
		token:
			typeof raw.token === 'string' && raw.token.length > 0
				? raw.token
				: undefined,
		redirect: typeof raw.redirect === 'string' ? raw.redirect : undefined,
	}),
	beforeLoad: ({ search }) => {
		if (getAccessToken()) {
			throw redirect({ to: safeInternalPath(search.redirect) })
		}
	},
	component: SignInLinkPage,
})

function SignInLinkPage() {
	const navigate = useNavigate()
	const search = Route.useSearch()
	const token = search.token

	const [email, setEmail] = useState('')
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
	const [message, setMessage] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const [consumeState, setConsumeState] = useState<
		'idle' | 'loading' | 'error'
	>('idle')
	const [consumeError, setConsumeError] = useState<string | null>(null)
	const consumeStarted = useRef(false)

	useEffect(() => {
		if (!token) return

		if (consumeStarted.current) return
		consumeStarted.current = true

		setConsumeState('loading')
		setConsumeError(null)

		void (async () => {
			try {
				const { data } = await api.post<{ accessToken: string }>(
					'/sessions/magic-link/verify',
					{ token, rememberMe: false },
				)
				setAccessToken(data.accessToken)
				const target = safeInternalPath(search.redirect)
				await navigate({ to: target === '/sign-in-link' ? '/' : target })
			} catch (err) {
				setConsumeState('error')
				setConsumeError(getApiErrorMessage(err))
				consumeStarted.current = false
			}
		})()
	}, [token, navigate, search.redirect])

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setStatus('idle')
		setMessage(null)
		setSubmitting(true)
		try {
			await api.post('/sessions/magic-link', { email })
			setStatus('success')
			setMessage(
				'Se existir uma conta ativa para este e-mail, enviaremos um link em instantes.',
			)
		} catch (err) {
			setStatus('error')
			setMessage(getApiErrorMessage(err))
		} finally {
			setSubmitting(false)
		}
	}

	if (token) {
		if (consumeState === 'loading') {
			return (
				<div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
					<Card className="w-full max-w-sm border border-border shadow-sm">
						<CardHeader className="text-center">
							<CardTitle>Entrando…</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-center text-muted-foreground text-sm">
								Validando seu link de acesso.
							</p>
						</CardContent>
					</Card>
				</div>
			)
		}

		if (consumeState === 'error' && consumeError) {
			return (
				<div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
					<Card className="w-full max-w-sm border border-border shadow-sm">
						<CardHeader className="text-center">
							<CardTitle>Não foi possível entrar</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm">
								{consumeError}
							</p>
							<Button asChild className="w-full" variant="outline">
								<Link to="/sign-in">Voltar ao login</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			)
		}

		return null
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-sm border border-border shadow-sm">
				<CardHeader className="text-center">
					<CardTitle>Entrar com link no e-mail</CardTitle>
					<p className="text-muted-foreground text-sm">
						Enviamos um link de acesso para o seu e-mail.
					</p>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
						{message ? (
							<p
								className={
									status === 'error'
										? 'rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm'
										: 'rounded-md border border-border bg-muted/40 px-3 py-2 text-sm'
								}
							>
								{message}
							</p>
						) : null}
						<div className="space-y-2">
							<Label htmlFor="sign-in-link-email">E-mail</Label>
							<Input
								autoComplete="email"
								id="sign-in-link-email"
								name="email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="voce@exemplo.com"
								required
								type="email"
								value={email}
							/>
						</div>
						<Button
							className="w-full"
							disabled={submitting}
							size="lg"
							type="submit"
						>
							{submitting ? 'Enviando…' : 'Enviar link para login'}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex-col border-border border-t">
					<p className="text-center text-sm text-muted-foreground">
						<Link
							className="font-medium text-primary underline-offset-4 hover:underline"
							to="/sign-in"
						>
							Voltar ao login
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}
