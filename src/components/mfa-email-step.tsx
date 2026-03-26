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
import { setAccessToken } from '@/lib/auth'
import { api, getApiErrorMessage } from '@/lib/http'

type MfaEmailStepProps = {
	mfaToken: string
	onMfaTokenChange: (token: string) => void
	onVerified: () => void
	onBack: () => void
	backLabel?: string
}

export function MfaEmailStep({
	mfaToken,
	onMfaTokenChange,
	onVerified,
	onBack,
	backLabel = 'Voltar',
}: MfaEmailStepProps) {
	const [code, setCode] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [resending, setResending] = useState(false)

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setError(null)
		setSubmitting(true)
		try {
			const { data } = await api.post<{ accessToken: string }>(
				'/sessions/mfa/verify',
				{ mfaToken, code: code.trim() },
			)
			setAccessToken(data.accessToken)
			onVerified()
		} catch (err) {
			setError(getApiErrorMessage(err))
		} finally {
			setSubmitting(false)
		}
	}

	async function handleResend() {
		setError(null)
		setResending(true)
		try {
			const { data } = await api.post<{ mfaToken: string }>(
				'/sessions/mfa/resend',
				{ mfaToken },
			)
			onMfaTokenChange(data.mfaToken)
		} catch (err) {
			setError(getApiErrorMessage(err))
		} finally {
			setResending(false)
		}
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-sm border border-border shadow-sm">
				<CardHeader className="text-center">
					<CardTitle>Verificação em duas etapas</CardTitle>
					<CardDescription>
						Digite o código numérico enviado ao seu e-mail.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
						{error ? (
							<p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm">
								{error}
							</p>
						) : null}
						<div className="space-y-2">
							<Label htmlFor="mfa-code">Código</Label>
							<Input
								autoComplete="one-time-code"
								id="mfa-code"
								inputMode="numeric"
								name="mfa-code"
								onChange={(e) => setCode(e.target.value)}
								placeholder="000000"
								required
								value={code}
							/>
						</div>
						<Button
							className="w-full"
							disabled={submitting}
							size="lg"
							type="submit"
						>
							{submitting ? 'Verificando…' : 'Confirmar'}
						</Button>
					</form>
					<Button
						className="w-full"
						disabled={resending}
						onClick={() => void handleResend()}
						type="button"
						variant="outline"
					>
						{resending ? 'Enviando…' : 'Reenviar código'}
					</Button>
					<Button
						className="w-full"
						onClick={onBack}
						type="button"
						variant="ghost"
					>
						{backLabel}
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
