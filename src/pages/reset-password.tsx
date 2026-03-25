import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api, getApiErrorMessage } from '@/lib/http'

type ResetPasswordSearch = { token?: string }

export const Route = createFileRoute('/reset-password')({
	validateSearch: (raw: Record<string, unknown>): ResetPasswordSearch => ({
		token: typeof raw.token === 'string' && raw.token.length > 0 ? raw.token : undefined,
	}),
	beforeLoad: ({ search }) => {
		if (!search.token) {
			throw redirect({ to: '/forgot-password' })
		}
	},
	component: ResetPasswordPage,
})

function ResetPasswordPage() {
	const navigate = useNavigate()
	const search = Route.useSearch()
	const token = search.token as string

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
	const [message, setMessage] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()

		setStatus('idle')
		setMessage(null)
		setSubmitting(true)

		try {
			await api.post('/password/reset', {
				token,
				password,
				confirmPassword,
			})

			setStatus('success')
			setMessage('Senha redefinida com sucesso.')

			// Redireciona após a resposta, mantendo também um link manual.
			setTimeout(() => {
				void navigate({ to: '/sign-in' })
			}, 1200)
		} catch (err) {
			setStatus('error')
			setMessage(getApiErrorMessage(err))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-sm border border-border shadow-sm">
				<CardHeader className="text-center">
					<CardTitle>Redefinir senha</CardTitle>
					<CardDescription>
						Informe uma nova senha para concluir a recuperação.
					</CardDescription>
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

						{status === 'success' ? (
							<div className="text-sm text-muted-foreground">
								Se não redirecionar automaticamente,{' '}
								<Link className="font-medium text-primary underline-offset-4 hover:underline" to="/sign-in">
									clique aqui para fazer login
								</Link>
								.
							</div>
						) : null}

						<div className="space-y-2">
							<Label htmlFor="reset-password-password">Nova senha</Label>
							<Input
								autoComplete="new-password"
								id="reset-password-password"
								name="password"
								onChange={(e) => setPassword(e.target.value)}
								required
								type="password"
								value={password}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="reset-password-confirmPassword">Confirmar senha</Label>
							<Input
								autoComplete="new-password"
								id="reset-password-confirmPassword"
								name="confirmPassword"
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								type="password"
								value={confirmPassword}
							/>
						</div>

						<Button
							className="w-full"
							disabled={submitting || status === 'success'}
							size="lg"
							type="submit"
						>
							{submitting ? 'Atualizando…' : 'Atualizar senha'}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex-col border-border border-t">
					<p className="text-center text-sm text-muted-foreground">
						Lembrou da senha?{' '}
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

