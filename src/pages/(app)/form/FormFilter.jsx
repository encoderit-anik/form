import { useCollection2 } from '@/hooks/useCollection2'
import clsx from 'clsx'

export default function FormFilter({ currentFilter, changeFilter }) {
	const { data: languages } = useCollection2('languages')
	return (
		<div className="question-filter">
			<nav>
				<p>Filter by: </p>
				<div className="flex">
					{[{ name: 'All', value: 'all' }, ...languages].map((language, index) => (
						<button
							key={index}
							onClick={() => changeFilter(language.value)}
							className={clsx('px-2', {
								active: currentFilter === language.value,
							})}
						>
							{language.name}
						</button>
					))}
				</div>
			</nav>
		</div>
	)
}
