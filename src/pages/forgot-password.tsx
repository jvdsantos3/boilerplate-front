import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/forgot-password')({
	component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
	return (
		<div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-muted/30 p-4">
			<p className="text-center text-sm text-muted-foreground">
				Recuperação de senha em breve.
			</p>
			<Link
				className="text-sm font-medium text-primary underline-offset-4 hover:underline"
				to="/sign-in"
			>
				Voltar ao login
			</Link>
		</div>
	)
}
