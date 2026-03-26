import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MfaEmailStep } from '@/components/mfa-email-step'
import { getAccessToken, setAccessToken } from '@/lib/auth'
import { api, getApiErrorMessage } from '@/lib/http'
import {
	isMfaEmailRequired,
	type SessionLoginResponse,
} from '@/lib/session-login'
import { safeInternalPath } from '@/lib/safe-redirect'

type SignInSearch = { redirect?: string }

export const Route = createFileRoute('/sign-in')({
	validateSearch: (raw: Record<string, unknown>): SignInSearch => ({
		redirect: typeof raw.redirect === 'string' ? raw.redirect : undefined,
	}),
	beforeLoad: ({ search }) => {
		if (getAccessToken()) {
			throw redirect({ to: safeInternalPath(search.redirect) })
		}
	},
	component: SignInPage,
})

function SignInPage() {
	const navigate = useNavigate()
	const search = Route.useSearch()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
	const [mfaToken, setMfaToken] = useState<string | null>(null)

	async function afterAccessTokenSet() {
		const target = safeInternalPath(search.redirect)
		if (target === '/sign-in') {
			await navigate({ to: '/' })
		} else {
			await navigate({ to: target })
		}
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setError(null)
		setSubmitting(true)
		try {
			const { data } = await api.post<SessionLoginResponse>('/sessions', {
				email,
				password,
				rememberMe,
			})
			if (isMfaEmailRequired(data)) {
				setMfaToken(data.mfaToken)
				setStep('mfa')
				return
			}
			setAccessToken(data.accessToken)
			await afterAccessTokenSet()
		} catch (err) {
			setError(getApiErrorMessage(err))
		} finally {
			setSubmitting(false)
		}
	}

	if (step === 'mfa' && mfaToken) {
		return (
			<MfaEmailStep
				backLabel="Voltar ao login"
				mfaToken={mfaToken}
				onBack={() => {
					setStep('credentials')
					setMfaToken(null)
				}}
				onMfaTokenChange={setMfaToken}
				onVerified={() => void afterAccessTokenSet()}
			/>
		)
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-sm border border-border shadow-sm">
				<CardHeader className="text-center">
					<CardTitle>Entrar</CardTitle>
					<CardDescription>
						Informe seu e-mail e senha para continuar.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
						{error ? (
							<p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm">
								{error}
							</p>
						) : null}
						<div className="space-y-2">
							<Label htmlFor="sign-in-email">E-mail</Label>
							<Input
								autoComplete="email"
								id="sign-in-email"
								name="email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="voce@exemplo.com"
								required
								type="email"
								value={email}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="sign-in-password">Senha</Label>
							<Input
								autoComplete="current-password"
								id="sign-in-password"
								name="password"
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								type="password"
								value={password}
							/>
						</div>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<Checkbox
									checked={rememberMe}
									id="sign-in-remember"
									onCheckedChange={(c) => setRememberMe(c === true)}
								/>
								<Label
									className="cursor-pointer font-normal"
									htmlFor="sign-in-remember"
								>
									Lembrar-me
								</Label>
							</div>
							<Link
								className="text-sm font-medium text-primary underline-offset-4 hover:underline"
								to="/forgot-password"
							>
								Esqueceu sua senha?
							</Link>
						</div>
						<Button
							className="w-full"
							disabled={submitting}
							size="lg"
							type="submit"
						>
							{submitting ? 'Entrando…' : 'Entrar'}
						</Button>
					</form>
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-border border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">ou</span>
						</div>
					</div>
					<Button asChild className="w-full" variant="outline">
						<Link to="/sign-in-link">Entrar com link no e-mail</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
