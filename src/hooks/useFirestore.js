import { useReducer, useEffect, useState } from 'react'
import { projectFirestore, timestamp } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'

let initialState = {
	document: null,
	isPending: false,
	error: null,
	success: null,
}

const firestoreReducer = (state, action) => {
	switch (action.type) {
		case 'IS_PENDING':
			return { isPending: true, document: null, success: false, error: null }
		case 'ADDED_DOCUMENT':
			return { isPending: false, document: action.payload, success: true, error: null }
		case 'DELETED_DOCUMENT':
			return { isPending: false, document: null, success: true, error: null }
		case 'UPDATED_DOCUMENT':
			return { isPending: false, document: action.payload, success: true, error: null }
		case 'ERROR':
			return { isPending: false, document: null, success: false, error: action.payload }
		default:
			return state
	}
}

export const useFirestore = (collection) => {
	const [response, dispatch] = useReducer(firestoreReducer, initialState)
	const [isCancelled, setIsCancelled] = useState(false)
	const { user } = useAuthContext()
	// collection ref
	const ref = projectFirestore.collection(collection)

	// only dispatch is not cancelled
	const dispatchIfNotCancelled = (action) => {
		if (!isCancelled) {
			dispatch(action)
		}
	}

	// add a document
	const addDocument = async (doc) => {
		dispatch({ type: 'IS_PENDING' })

		try {
			const createdAt = timestamp.fromDate(new Date())
			const addedDocument = await ref.add({ ...doc, createdAt })
			dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
		} catch (err) {
			dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
		}
	}

	// delete a document
	const deleteDocument = async (id) => {
		dispatch({ type: 'IS_PENDING' })

		try {
			await ref.doc(id).delete()
			dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
		} catch (err) {
			dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
		}
	}
	// update documents

	const updateDocument = async (id, updates) => {
		dispatch({ type: 'IS_PENDING' })
		try {
			const updatedDocument = await ref.doc(id).update(updates)
			dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument })
			return updatedDocument
		} catch (err) {
			dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
			return null
		}
	}

	useEffect(() => {
		return () => setIsCancelled(true)
	}, [])

	const addNotification = async (commentAuthorId, type, questionId, commentId) => {
		dispatch({ type: 'IS_PENDING' })

		try {
			const createdAt = timestamp.fromDate(new Date())
			const notification = await projectFirestore.collection('notifications').add({
				userId: commentAuthorId, // Use commentAuthorId instead of user.uid
				type,
				questionId,
				commentId,
				createdAt,
				displayName: user.displayName,
			})

			console.log('Notification added:', notification)

			dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: notification })
		} catch (err) {
			console.error('Error adding notification:', err)
			dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
		}
	}
	// const handleLikeComment = async (commentId) => {
	// 	try {
	// 		const commentRef = projectFirestore.collection('comments').doc(commentId)
	// 		const snapshot = await commentRef.get()
	// 		const existingLikes = snapshot.data().likes || new Set()

	// 		if (!existingLikes.has(user.uid)) {
	// 			await projectFirestore.runTransaction(async (transaction) => {
	// 				const newLikes = new Set(existingLikes)
	// 				newLikes.add(user.uid)
	// 				await transaction.update(commentRef, { likes: newLikes })
	// 			})
	// 			// Update UI to reflect the like
	// 			// ... your UI update logic here ...
	// 		}
	// 	} catch (error) {
	// 		console.error('Error liking comment:', error)
	// 		// Handle error gracefully
	// 	}
	// }

	// const handleDislikeComment = async (commentId) => {
	// 	try {
	// 		const commentRef = projectFirestore.collection('comments').doc(commentId)
	// 		const snapshot = await commentRef.get()
	// 		const existingDislikes = snapshot.data().dislikes || new Set()

	// 		if (!existingDislikes.has(user.uid)) {
	// 			await projectFirestore.runTransaction(async (transaction) => {
	// 				const newDislikes = new Set(existingDislikes)
	// 				newDislikes.add(user.uid)
	// 				await transaction.update(commentRef, { dislikes: newDislikes })
	// 			})
	// 			// Update UI to reflect the dislike
	// 			// ... your UI update logic here ...
	// 		}
	// 	} catch (error) {
	// 		console.error('Error disliking comment:', error)
	// 		// Handle error gracefully
	// 	}
	// }

	return {
		addDocument,
		deleteDocument,
		response,
		updateDocument,
		addNotification,
		// handleLikeComment,
		// handleDislikeComment,
	}
}
