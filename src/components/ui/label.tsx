import { Label as LabelPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { tv } from 'tailwind-variants'

const label = tv({
	base: [
		'flex items-center gap-2 text-sm leading-none font-medium select-none',
		'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
		'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
	],
})

type LabelProps = ComponentProps<typeof LabelPrimitive.Root>

function Label({ className, ...props }: LabelProps) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={label({ className })}
			{...props}
		/>
	)
}

export { Label, type LabelProps, label }
