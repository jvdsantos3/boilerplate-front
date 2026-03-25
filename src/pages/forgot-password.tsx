import { createFileRoute, Link } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { api, getApiErrorMessage } from '@/lib/http'
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

export const Route = createFileRoute('/forgot-password')({
	component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
	const [message, setMessage] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setStatus('idle')
		setMessage(null)
		setSubmitting(true)
		try {
			await api.post('/password/forgot', { email })
			setStatus('success')
			setMessage(
				'Se existir uma conta para este e-mail, enviaremos instrucoes em instantes.',
			)
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
					<CardTitle>Esqueceu sua senha?</CardTitle>
					<CardDescription>
						Informe seu e-mail para receber instrucoes de redefinicao.
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
						<div className="space-y-2">
							<Label htmlFor="forgot-password-email">E-mail</Label>
							<Input
								autoComplete="email"
								id="forgot-password-email"
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
							{submitting ? 'Enviando…' : 'Enviar link de recuperacao'}
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
