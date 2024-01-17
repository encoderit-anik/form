// Chat.js
import { useCallback, useMemo, useState } from 'react'
import { Messages } from '@/firebase/config'
import { useCollection2 } from '@/hooks/useCollection2'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useUsersContext } from '@/context/UsersContext'
import { formatDistanceToNow } from 'date-fns'

import clsx from 'clsx'
import Avatar from '@/components/Avatar'

export const Component = () => {
	const { user } = useAuthContext()
	const { data } = useCollection2(
		'chat',
		{
			limit: 50,
			orderBy: ['createdAt', 'desc'],
		},
		{
			orderBy: ['createdAt', 'desc'],
		}
	)
	const { users } = useUsersContext()

	const [text, setText] = useState('')
	const disabled = useMemo(() => !text.trim().length, [text])

	const onSendMessage = useCallback(async () => {
		if (disabled) return
		const message = {
			text,
			senderId: user.uid,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}
		setText('')
		await Messages.add(message)
	}, [text])

	const messages = useMemo(() => {
		return data.map((message) => {
			return {
				...message,
				isMine: message.senderId === user.uid,
				sender: users.find((user) => {
					return user.uid === message.senderId
				}),
			}
		})
	}, [data, users])

	return (
		<div className="absolute inset-x-0 bottom-0 top-[100px] flex flex-col">
			<div className="flex-1 flex flex-col-reverse overflow-auto pb-[70px]">
				{messages.map((message, index) => (
					<div key={index} className={clsx('mb-2 max-w-2xl w-full mx-auto flex flex-col', {})}>
						{!message.isMine && messages[index + 1]?.sender?.uid !== message.senderId && (
							<div className="text-xs flex items-center space-x-1 mb-1 mt-4">
								<Avatar src={message.sender?.photoURL} className="!w-4 !h-4" />
								<div>{message.sender?.displayName}</div>
							</div>
						)}
						<div
							className={clsx('flex', {
								'justify-end': message.isMine,
							})}
						>
							<div
								className={clsx('text-base max-w-[80%]', {
									'bg-neutral-200 px-3 py-1 rounded-lg': !message.isMine,
									'text-right bg-[#8d69f1] bg-opacity-20 px-2 py-1 rounded-lg':
										message.isMine,
								})}
							>
								{message.text}
							</div>
						</div>
						{messages[index - 1]?.sender?.uid !== message.senderId && (
							<div
								className={clsx('text-[10px] mt-1 text-neutral-500', {
									'text-right': message.isMine,
								})}
							>
								{formatDistanceToNow(new Date(message.createdAt), {
									addSuffix: true,
								})}
							</div>
						)}
					</div>
				))}
			</div>
			<div className="absolute bottom-0 inset-x-0 py-3 bg-white bg-opacity-10 backdrop-blur">
				<div className="flex items-center space-x-2 max-w-lg mx-auto">
					<input
						type="text"
						value={text}
						placeholder="Type your message..."
						className="bg-white px-4 py-2 text-base border border-neutral-200 rounded-full focus:outline-none"
						onChange={(e) => setText(e.target.value || '')}
						onKeyUp={(e) => e.key === 'Enter' && onSendMessage()}
					/>
					<button
						disabled={disabled}
						className={clsx(
							'px-4 py-2 text-base bg-white border rounded-full ',
							disabled
								? 'border-neutral-200 text-[#777]'
								: 'border-[var(--primary-color)] text-[var(--primary-color)]'
						)}
						onClick={(e) => onSendMessage()}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	)
}
