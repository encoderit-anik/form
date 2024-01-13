import { Icon } from '@iconify/react'
import { clsx } from 'clsx'

export default function IconButton({ icon, iconClass, className, onClick }) {
	return (
		<button
			className={clsx(
				'w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700',
				className
			)}
			onClick={onClick}
		>
			<Icon className={clsx('text-lg', iconClass)} icon={icon} />
		</button>
	)
}
