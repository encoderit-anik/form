import clsx from 'clsx'

export default function Table({ headers = [], items = [] }) {
	return (
		<div className="mt-8 bg-white border rounded-lg overflow-hidden shadow-lg">
			<table className="w-full border-collapse text-left text-sm">
				<thead>
					<tr className="">
						{headers.map((header, index) => (
							<th key={index} className={clsx(header.thClass, 'p-4 font-medium uppercase')}>
								{header.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{items.map((user, index) => (
						<tr key={index} className="border-t">
							{headers.map((header, index) => (
								<td key={index} className="p-4">
									<div className={clsx(header.tdClass)}>{header.value?.(user)}</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
