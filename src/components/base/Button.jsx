import { clsx } from 'clsx'

export default function Button({ children }) {
	return (
		<button
			className={clsx('btn', {
				//
			})}
		>
			{children}
		</button>
	)
}
