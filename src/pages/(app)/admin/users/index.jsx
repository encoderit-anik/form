import { clsx } from 'clsx'
import { useUsersContext } from '@/context/UsersContext'
import { useCallback, useState } from 'react'

import Avatar from '@/components/Avatar'
import IconButton from '@/components/base/IconButton'
import Table from '@/components/base/Table'

export const Component = () => {
	const { users } = useUsersContext()

	const onDeleteUser = useCallback((v) => {
		if (confirm(`Are you sure delete this user?`)) {
			v.doc.ref.update({
				updatedAt: Date.now(),
				deletedAt: Date.now(),
			})
		}
	}, [])

	const onBlockUnblockUser = useCallback((v) => {
		if (confirm(`Are you sure to ${v.isBlocked ? 'unblock' : 'block'} this user?`)) {
			v.doc.ref.update({
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
			<Table headers={headers} items={users} />
		</div>
	)
}
