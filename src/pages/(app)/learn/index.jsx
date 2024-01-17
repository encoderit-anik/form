export const Component = () => {
	const pages = [
		{
			title: 'HTML Basics Tutorial',
			href: '/html.html',
		},
		{
			title: 'CSS Basics Tutorial',
			href: '/css.html',
		},
		{
			title: 'Basic syntax of C# and Functions',
			href: '/csharp.html',
		},
		{
			title: 'Introduction to Python Arrays',
			href: '/python.html',
		},
	]
	return (
		<div>
			<h1 className="text-2xl font-bold">Learn</h1>
			<ul className="mt-8 space-y-4 list-disc pl-8">
				{pages.map((page, index) => (
					<li key={index}>
						<a href={page.href} className="text-lg hover:text-blue-500 hover:underline">
							{page.title}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}
