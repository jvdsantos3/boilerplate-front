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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/sign-in-link')({
	component: SignInLinkPage,
})

function SignInLinkPage() {
	const [email, setEmail] = useState('')

	function handleSubmit(e: FormEvent) {
		e.preventDefault()
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-sm border border-border shadow-sm">
				<CardHeader className="text-center">
					<CardTitle>Entrar com link no e-mail</CardTitle>
					<CardDescription>
						Enviamos um link de acesso para o seu e-mail.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
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
						<Button className="w-full" size="lg" type="submit">
							Enviar link para login
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
