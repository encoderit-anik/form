import React, { useState, useEffect } from 'react'
import { useFirestore } from '@/hooks/useFirestore'
import { useAuthContext } from '@/hooks/useAuthContext'
import './ChatRoom.css'

const ChatRoom = () => {
	const { user } = useAuthContext()
	const { response, error, addDocument } = useFirestore('chat')
	const [message, setMessage] = useState('')

	const handleSendMessage = async (e) => {
		e.preventDefault()

		if (message.trim() === '') {
			return
		}

		const newMessage = {
			text: message,
			senderId: user.uid,
			senderName: user.displayName,
			timestamp: new Date(),
		}

		console.log('Adding new message:', newMessage)
		await addDocument(newMessage)
		setMessage('')
	}

	// useEffect(() => {
	// 	console.log('Response:', response)
	// 	console.log('Error:', error)

	// 	const chatContainer = document.getElementById('chat-container')
	// 	chatContainer.scrollTop = chatContainer.scrollHeight

	// 	if (response.document) {
	// 		console.log('Documents:', response.document)
	// 	} else {
	// 		console.log('No documents')
	// 	}
	// }, [response, error])

	return (
		<div>{/*  */}</div>
		// <div className="chat-room">
		// 	<div id="chat-container" className="chat-container">
		// 		{error && <p>Error: {error}</p>}

		// 		{response.document && response.document.length > 0 ? (
		// 			response.document.map((msg) => (
		// 				<div
		// 					key={msg.id}
		// 					className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}
		// 				>
		// 					<p>{msg.senderName}:</p>
		// 					<p>{msg.text}</p>
		// 				</div>
		// 			))
		// 		) : (
		// 			<p>No messages yet.</p>
		// 		)}
		// 	</div>

		// 	<form onSubmit={handleSendMessage} className="message-form">
		// 		<input
		// 			type="text"
		// 			value={message}
		// 			onChange={(e) => setMessage(e.target.value)}
		// 			placeholder="Type your message..."
		// 		/>
		// 		<button type="submit">Send</button>
		// 	</form>
		// </div>
	)
}

export default ChatRoom
