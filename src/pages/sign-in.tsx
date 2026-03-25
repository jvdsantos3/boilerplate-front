import { createFileRoute, Link } from '@tanstack/react-router'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/sign-in')({
	component: SignInPage,
})

function SignInPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)

	function handleSubmit(e: FormEvent) {
		e.preventDefault()
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
					<form className="space-y-4" onSubmit={handleSubmit}>
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
								Esqueci minha senha
							</Link>
						</div>
						<Button className="w-full" size="lg" type="submit">
							Entrar
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex-col border-border border-t">
					<p className="text-center text-sm text-muted-foreground">
						<Link
							className="font-medium text-primary underline-offset-4 hover:underline"
							to="/"
						>
							Voltar ao início
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}
