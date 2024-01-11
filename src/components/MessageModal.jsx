import './MessageModal.css'
import React, { useEffect, useState, useCallback } from 'react'
import { projectFirestore } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'
import disLikeIcon from '../assets/icons8-dislike-24.png'
import likeIcon from '../assets/icons8-like-24.png'

export default function MessageModal({ isOpen, onClose }) {
	const [notifications, setNotifications] = useState([])
	const [error, setError] = useState(null)
	const { user } = useAuthContext()

	const groupNotifications = useCallback(
		(notificationsData) => {
			const groupedNotifications = []

			notificationsData.forEach((notification, index) => {
				const currentUserName = user.displayName
				const nextNotification = notificationsData[index + 1]

				if (
					notification.displayName === currentUserName &&
					nextNotification?.displayName === currentUserName
				) {
					// Skip consecutive notifications from the same user
					return
				}

				groupedNotifications.push(notification)
			})

			return groupedNotifications
		},
		[user]
	)

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				if (user && user.uid && isOpen) {
					const userId = user.uid
					const notificationsRef = projectFirestore
						.collection('notifications')
						.where('userId', '==', userId)
					const snapshot = await notificationsRef.get()
					const notificationsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

					// Filter notifications based on the current user's ID
					const filteredNotifications = notificationsData.filter(
						(notification) => notification.type === 'like' || notification.type === 'dislike'
					)

					setNotifications(groupNotifications(filteredNotifications))
					setError(null)
				}
			} catch (error) {
				console.error('Error fetching notifications:', error)
				setError(`Error fetching notifications: ${error.message}`)
			}
		}

		if (isOpen) {
			fetchNotifications()
		}
	}, [isOpen, user, groupNotifications])

	const getNotificationMessage = (notification) => {
		const action =
			notification.type === 'like' ? (
				<img src={likeIcon} alt="Like" className="notification-icon" />
			) : (
				<img src={disLikeIcon} alt="Dislike" className="notification-icon" />
			)

		return (
			<span>
				{action} {notification.displayName} your comment
			</span>
		)
	}
	return (
		<div className={`modal ${isOpen ? 'open' : ''}`}>
			<div className="modal-content">
				<span className="close" onClick={onClose}>
					&times;
				</span>
				<h3>Notifications</h3>
				{error && <p>Error: {error}</p>}
				<ul>
					{notifications.map((notification) => (
						<li key={notification.id}>
							{/* Use the getNotificationMessage function here */}
							<p>{getNotificationMessage(notification)}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
