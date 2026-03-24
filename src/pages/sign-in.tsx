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

function SignInPage() {
	const emailId = useId()
	const passwordId = useId()
	const rememberId = useId()
	const [remember, setRemember] = useState(false)

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

				<form
					onSubmit={handleSubmit}
					className="space-y-4 rounded-xl border bg-card p-6 shadow-sm"
					noValidate
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
									description: 'Fluxo de “esqueci minha senha” será ligado à API em seguida.',
								})
							}
						>
							Esqueci minha senha
						</Button>
					</div>

					<Button type="submit" className="w-full">
						Entrar
					</Button>
				</form>
			</div>
		</div>
	)
}
