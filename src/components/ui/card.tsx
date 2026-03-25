import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const card = tv({
	base: [
		'group/card flex flex-col overflow-hidden rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10',
		'has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
	],
	variants: {
		size: {
			default: 'gap-6 py-6',
			sm: 'gap-4 py-4',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

const cardHeader = tv({
	base: [
		'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-6',
		'group-data-[size=sm]/card:px-4',
		'has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
		'[.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4',
	],
})

const cardTitle = tv({
	base: 'font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm',
})

const cardDescription = tv({
	base: 'text-sm text-muted-foreground',
})

const cardAction = tv({
	base: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
})

const cardContent = tv({
	base: 'px-6 group-data-[size=sm]/card:px-4',
})

const cardFooter = tv({
	base: [
		'flex items-center rounded-b-xl px-6 group-data-[size=sm]/card:px-4',
		'[.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4',
	],
})

type CardVariants = VariantProps<typeof card>
type CardProps = ComponentProps<'div'> & CardVariants
type CardHeaderProps = ComponentProps<'div'>
type CardTitleProps = ComponentProps<'div'>
type CardDescriptionProps = ComponentProps<'div'>
type CardActionProps = ComponentProps<'div'>
type CardContentProps = ComponentProps<'div'>
type CardFooterProps = ComponentProps<'div'>

function Card({ className, size = 'default', ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={card({ size, className })}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: CardHeaderProps) {
	return (
		<div
			data-slot="card-header"
			className={cardHeader({ className })}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: CardTitleProps) {
	return (
		<div
			data-slot="card-title"
			className={cardTitle({ className })}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
	return (
		<div
			data-slot="card-description"
			className={cardDescription({ className })}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: CardActionProps) {
	return (
		<div
			data-slot="card-action"
			className={cardAction({ className })}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: CardContentProps) {
	return (
		<div
			data-slot="card-content"
			className={cardContent({ className })}
			{...props}
		/>
	)
}

function CardFooter({ className, ...props }: CardFooterProps) {
	return (
		<div
			data-slot="card-footer"
			className={cardFooter({ className })}
			{...props}
		/>
	)
}

export {
	Card,
	CardAction,
	type CardActionProps,
	CardContent,
	type CardContentProps,
	CardDescription,
	type CardDescriptionProps,
	CardFooter,
	type CardFooterProps,
	CardHeader,
	type CardHeaderProps,
	type CardProps,
	CardTitle,
	type CardTitleProps,
	type CardVariants,
	card,
	cardAction,
	cardContent,
	cardDescription,
	cardFooter,
	cardHeader,
	cardTitle,
}
