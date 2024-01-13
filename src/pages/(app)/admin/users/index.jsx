import { clsx } from 'clsx'
import { Users, projectFirestore } from '@/firebase/config'
import { useCallback, useEffect, useState } from 'react'

import Avatar from '@/components/Avatar'
import IconButton from '@/components/base/IconButton'

const useCollection = (name) => {
	const [data, setData] = useState([])
	const toItem = useCallback((v) => {
		return {
			uid: v.id,
			doc: v,
			...v.data(),
		}
	}, [])
	useEffect(() => {
		projectFirestore
			.collection(name)
			.where('deletedAt', '==', null)
			.get()
			.then((res) => res.docs.map(toItem))
			.then((res) => setData(res))
		return projectFirestore
			.collection(name)
			.orderBy('updatedAt', 'desc')
			.limit(1)
			.onSnapshot((snapshot) => {
				const newItem = toItem(snapshot.docs[0])
				setData((data) => {
					if (newItem.deletedAt) {
						return data.filter((item) => {
							return item.uid !== newItem.uid
						})
					}
					return data.map((item) => {
						return item.uid !== newItem.uid ? item : newItem
					})
				})
			})
	}, [])
	return { data }
}

export const Component = () => {
	const { data: users } = useCollection('users')

	const onDeleteUser = useCallback((v) => {
		if (confirm(`Are you sure delete this user?`)) {
			Users.doc(v.uid).update({
				updatedAt: Date.now(),
				deletedAt: Date.now(),
			})
		}
	}, [])

	const onBlockUnblockUser = useCallback((v) => {
		if (confirm(`Are you sure to ${v.isBlocked ? 'unblock' : 'block'} this user?`)) {
			Users.doc(v.uid).update({
				isBlocked: !v.isBlocked,
				updatedAt: Date.now(),
			})
		}
	}, [])

	const [headers] = useState([
		{
			label: 'Display Name',
			value: (v) => (
				<div className="flex items-center space-x-2">
					<Avatar src={v.photoURL} className="!w-8 !h-8" />
					<span>{v.displayName}</span>
				</div>
			),
		},
		{
			label: 'Role',
			thClass: 'text-center',
			tdClass: 'text-center',
			value: (v) => (v.isAdmin ? 'Admin' : 'User'),
		},
		{
			label: 'Email',
			thClass: 'text-center',
			tdClass: 'text-center',
			value: (v) => v.email,
		},
		{
			label: 'Status',
			thClass: 'text-center',
			tdClass: 'flex justify-center',
			value: (v) => (
				<span className="flex items-center space-x-2">
					<span
						className={clsx(
							'block w-2 h-2 rounded-full',
							v.online ? 'bg-green-500' : 'bg-neutral-500'
						)}
					></span>
					<span>{v.online ? 'online' : 'offline'}</span>
				</span>
			),
		},
		{
			label: 'Actions',
			thClass: 'text-right',
			tdClass: 'flex justify-end',
			value: (v) => (
				<div className="flex space-x-2">
					{!v.isAdmin && (
						<IconButton
							icon="bx:block"
							iconClass="!text-xl"
							className={clsx(v.isBlocked && '!bg-red-500 text-white')}
							onClick={() => onBlockUnblockUser(v)}
						/>
					)}
					<IconButton icon="bx:edit" />
					{!v.isAdmin && <IconButton icon="bx:trash" onClick={() => onDeleteUser(v)} />}
				</div>
			),
		},
	])

	return (
		<div>
			<h1 className="text-xl font-bold">Users</h1>
			<div className="mt-8 bg-white border rounded-lg overflow-hidden shadow-lg">
				<table className="w-full border-collapse text-left text-sm">
					<thead>
						<tr className="">
							{headers.map((header, index) => (
								<th
									key={index}
									className={clsx(header.thClass, 'p-4 font-medium uppercase')}
								>
									{header.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => (
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
		</div>
	)
}
