import { createFileRoute } from '@tanstack/react-router'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/sign-in')({
	component: SignInPage,
})

type SignInMethod = 'password' | 'totp' | 'magic-link'

const SIGN_IN_METHODS: { id: SignInMethod; label: string }[] = [
	{ id: 'password', label: 'E-mail e senha' },
	{ id: 'totp', label: 'TOTP / MFA' },
	{ id: 'magic-link', label: 'Link mágico' },
]

function SignInPage() {
	const emailId = useId()
	const passwordId = useId()
	const rememberId = useId()
	const totpEmailId = useId()
	const totpCodeId = useId()
	const magicEmailId = useId()
	const [remember, setRemember] = useState(false)
	const [method, setMethod] = useState<SignInMethod>('password')

	function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = e.currentTarget
		const email = (form.elements.namedItem('email') as HTMLInputElement).value
		const password = (form.elements.namedItem('password') as HTMLInputElement).value

		if (!email || !password) {
			toast.error('Preencha e-mail e senha.')
			return
		}

		toast.success('Entrada enviada (integração com API pendente).', {
			description: remember ? 'Lembrar-me marcado.' : undefined,
		})
	}

	function handleTotpSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = e.currentTarget
		const email = (form.elements.namedItem('totp-email') as HTMLInputElement).value
		const code = (form.elements.namedItem('totp-code') as HTMLInputElement).value.replace(
			/\s/g,
			'',
		)

		if (!email) {
			toast.error('Informe o e-mail.')
			return
		}
		if (!/^\d{6,8}$/.test(code)) {
			toast.error('Informe um código TOTP válido (6 a 8 dígitos).')
			return
		}

		toast.success('Verificação MFA enviada (integração com API pendente).')
	}

	function handleMagicLinkSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = e.currentTarget
		const email = (form.elements.namedItem('magic-email') as HTMLInputElement).value

		if (!email) {
			toast.error('Informe o e-mail para receber o link.')
			return
		}

		toast.success('Link mágico solicitado (integração com API pendente).', {
			description: 'Verifique a caixa de entrada e o spam.',
		})
	}

	return (
		<div className="relative flex min-h-svh flex-col items-center justify-center p-4">
			<div className="absolute top-4 right-4">
				<ThemeToggle />
			</div>

			<div className="w-full max-w-sm space-y-8">
				<header className="space-y-1 text-center">
					<h1 className="font-semibold text-xl tracking-tight">Administração Central</h1>
					<p className="text-muted-foreground text-sm">Fabricainfo | EID</p>
				</header>

				<div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
					<div
						className="flex flex-col gap-2 sm:flex-row sm:gap-1 sm:rounded-lg sm:bg-muted/50 sm:p-1"
						role="tablist"
						aria-label="Forma de entrada"
					>
						{SIGN_IN_METHODS.map(({ id, label }) => (
							<Button
								key={id}
								type="button"
								variant="ghost"
								size="sm"
								role="tab"
								id={`sign-in-tab-${id}`}
								aria-selected={method === id}
								aria-controls={`sign-in-panel-${id}`}
								tabIndex={method === id ? 0 : -1}
								className={cn(
									'justify-center rounded-md sm:flex-1',
									method === id
										? 'bg-background text-foreground shadow-sm'
										: 'text-muted-foreground hover:bg-transparent hover:text-foreground',
								)}
								onClick={() => setMethod(id)}
							>
								{label}
							</Button>
						))}
					</div>

					{method === 'password' && (
						<form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
							<div
								id="sign-in-panel-password"
								role="tabpanel"
								aria-labelledby="sign-in-tab-password"
								className="space-y-4"
							>
								<div className="space-y-2">
									<Label htmlFor={emailId}>E-mail</Label>
									<Input
										id={emailId}
										name="email"
										type="email"
										autoComplete="email"
										placeholder="seu@email.com"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor={passwordId}>Senha</Label>
									<Input
										id={passwordId}
										name="password"
										type="password"
										autoComplete="current-password"
										placeholder="••••••••"
										required
									/>
								</div>

								<div className="flex flex-wrap items-center justify-between gap-2">
									<div className="flex items-center gap-2">
										<Checkbox
											id={rememberId}
											checked={remember}
											onCheckedChange={(v) => setRemember(v === true)}
										/>
										<Label htmlFor={rememberId} className="font-normal text-muted-foreground">
											Lembrar-me
										</Label>
									</div>
									<Button
										type="button"
										variant="link"
										className={cn(
											'h-auto px-0 text-muted-foreground text-xs underline-offset-4 hover:text-foreground',
										)}
										onClick={() =>
											toast.message('Recuperação de senha', {
												description:
													'Fluxo de “esqueci minha senha” será ligado à API em seguida.',
											})
										}
									>
										Esqueci minha senha
									</Button>
								</div>

								<Button type="submit" className="w-full">
									Entrar
								</Button>
							</div>
						</form>
					)}

					{method === 'totp' && (
						<form onSubmit={handleTotpSubmit} className="space-y-4" noValidate>
							<div
								id="sign-in-panel-totp"
								role="tabpanel"
								aria-labelledby="sign-in-tab-totp"
								className="space-y-4"
							>
								<p className="text-muted-foreground text-xs leading-relaxed">
									Use o aplicativo autenticador (Google Authenticator, Authy, etc.) ou outro segundo
									fator configurado na sua conta.
								</p>
								<div className="space-y-2">
									<Label htmlFor={totpEmailId}>E-mail</Label>
									<Input
										id={totpEmailId}
										name="totp-email"
										type="email"
										autoComplete="username"
										placeholder="seu@email.com"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor={totpCodeId}>Código TOTP / MFA</Label>
									<Input
										id={totpCodeId}
										name="totp-code"
										type="text"
										inputMode="numeric"
										autoComplete="one-time-code"
										placeholder="000000"
										maxLength={8}
										className="font-mono tracking-widest"
										required
									/>
								</div>
								<Button type="submit" className="w-full">
									Verificar e entrar
								</Button>
							</div>
						</form>
					)}

					{method === 'magic-link' && (
						<form onSubmit={handleMagicLinkSubmit} className="space-y-4" noValidate>
							<div
								id="sign-in-panel-magic-link"
								role="tabpanel"
								aria-labelledby="sign-in-tab-magic-link"
								className="space-y-4"
							>
								<p className="text-muted-foreground text-xs leading-relaxed">
									Enviaremos um link seguro para o seu e-mail. Ele expira após alguns minutos.
								</p>
								<div className="space-y-2">
									<Label htmlFor={magicEmailId}>E-mail</Label>
									<Input
										id={magicEmailId}
										name="magic-email"
										type="email"
										autoComplete="email"
										placeholder="seu@email.com"
										required
									/>
								</div>
								<Button type="submit" className="w-full">
									Enviar link mágico
								</Button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	)
}
