import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

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
