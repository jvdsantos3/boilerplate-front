import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAccessToken } from '@/lib/auth'
import { api, getApiErrorMessage } from '@/lib/http'

export const Route = createFileRoute('/account/mfa')({
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
	component: AccountMfaPage,
})

function AccountMfaPage() {
	const [phase, setPhase] = useState<
		'idle' | 'code_sent' | 'disabled' | 'enabled_notice'
	>('idle')
	const [code, setCode] = useState('')
	const [disablePassword, setDisablePassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [busy, setBusy] = useState(false)

	async function handleRequestCode() {
		setError(null)
		setBusy(true)
		try {
			await api.post('/users/me/mfa/email')
			setPhase('code_sent')
		} catch (err) {
			setError(getApiErrorMessage(err))
		} finally {
			setBusy(false)
		}
	}

	async function handleVerifyEnrollment(e: FormEvent) {
		e.preventDefault()
		setError(null)
		setBusy(true)
		try {
			await api.post('/users/me/mfa/email/verify', {
				code: code.trim(),
			})
			setPhase('enabled_notice')
		} catch (err) {
			setError(getApiErrorMessage(err))
		} finally {
			setBusy(false)
		}
	}

	async function handleDisable(e: FormEvent) {
		e.preventDefault()
		setError(null)
		setBusy(true)
		try {
			const { data: reauth } = await api.post<{ reauthToken: string }>(
				'/sessions/reauth',
				{ password: disablePassword },
			)
			await api.post(
				'/users/me/mfa/email/disable',
				{ password: disablePassword },
				{
					headers: { 'x-reauth-token': reauth.reauthToken },
				},
			)
			setPhase('disabled')
			setDisablePassword('')
		} catch (err) {
			setError(getApiErrorMessage(err))
		} finally {
			setBusy(false)
		}
	}

	return (
		<div className="mx-auto max-w-md space-y-6 p-6">
			<div className="flex items-center justify-between gap-4">
				<h1 className="font-semibold text-2xl">Segurança da conta</h1>
				<Button asChild variant="outline">
					<Link to="/">Voltar</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>MFA por e-mail</CardTitle>
					<CardDescription>
						Após ativar, cada login envia um segundo código ao seu e-mail.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{error ? (
						<p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm">
							{error}
						</p>
					) : null}

					{phase === 'enabled_notice' ? (
						<p className="text-muted-foreground text-sm">
							Verificação em duas etapas por e-mail está ativa. Para desativar,
							use o formulário abaixo.
						</p>
					) : null}

					{phase === 'disabled' ? (
						<p className="text-muted-foreground text-sm">
							MFA por e-mail foi desativado.
						</p>
					) : null}

					<div className="space-y-3 border-border border-t pt-4">
						<h2 className="font-medium text-sm">Ativar</h2>
						{phase === 'code_sent' ? (
							<form
								className="space-y-3"
								onSubmit={(e) => void handleVerifyEnrollment(e)}
							>
								<div className="space-y-2">
									<Label htmlFor="enroll-code">Código do e-mail</Label>
									<Input
										autoComplete="one-time-code"
										id="enroll-code"
										inputMode="numeric"
										onChange={(e) => setCode(e.target.value)}
										placeholder="000000"
										required
										value={code}
									/>
								</div>
								<Button disabled={busy} type="submit">
									{busy ? 'Confirmando…' : 'Confirmar ativação'}
								</Button>
							</form>
						) : (
							<Button
								disabled={busy || phase === 'enabled_notice'}
								onClick={() => void handleRequestCode()}
								type="button"
								variant="secondary"
							>
								{busy ? 'Enviando…' : 'Enviar código de ativação'}
							</Button>
						)}
					</div>

					<div className="space-y-3 border-border border-t pt-4">
						<h2 className="font-medium text-sm">Desativar</h2>
						<form
							className="space-y-3"
							onSubmit={(e) => void handleDisable(e)}
						>
							<div className="space-y-2">
								<Label htmlFor="disable-password">Senha atual</Label>
								<Input
									autoComplete="current-password"
									id="disable-password"
									onChange={(e) => setDisablePassword(e.target.value)}
									required
									type="password"
									value={disablePassword}
								/>
							</div>
							<p className="text-muted-foreground text-xs">
								É necessário confirmar a senha; o servidor também exige um token
								de reautenticação (obtido automaticamente antes do envio).
							</p>
							<Button disabled={busy} type="submit" variant="destructive">
								{busy ? 'Desativando…' : 'Desativar MFA por e-mail'}
							</Button>
						</form>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
