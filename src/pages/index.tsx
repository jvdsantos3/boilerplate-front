import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<h1>Hello World /</h1>
			<Button onClick={() => toast.success('Hello World')}>Click me</Button>
		</div>
	)
}
