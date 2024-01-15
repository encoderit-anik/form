import { useEffect, useState, useRef } from 'react'
import { projectFirestore } from '../firebase/config'
import { isEqual } from 'date-fns'

export const useCollection = (collection, _query, _orderBy) => {
	const [documents, setDocuments] = useState(null)
	const [error, setError] = useState(null)

	// if we don't use a ref --> infinite loop in useEffect
	// _query is an array and is "different" on every function call
	const query = useRef(_query).current
	const orderBy = useRef(_orderBy).current

	useEffect(() => {
		let ref = projectFirestore.collection(collection)

		if (query) {
			ref = ref.where(...query)
		}
		if (orderBy) {
			ref = ref.orderBy(...orderBy)
		}

		const unsubscribe = ref.onSnapshot(
			(snapshot) => {
				// update state
				setDocuments(
					snapshot.docs.map((doc) => ({
						doc,
						id: doc.id,
						...doc.data(),
					}))
				)
				setError(null)
			},
			(error) => {
				console.log(error)
				setError('could not fetch the data')
			}
		)

		// unsubscribe on unmount
		return () => unsubscribe()
	}, [collection, query, orderBy])
	const updateDisplayName = async (userId, newDisplayName) => {
		try {
			const snapshot = await projectFirestore.collection(collection).get()
			const batch = projectFirestore.batch()

			snapshot.docs.forEach((doc) => {
				const data = doc.data()
				let updatedData = { ...data }

				if (data.createdBy && data.createdBy.id === userId) {
					updatedData = {
						...updatedData,
						createdBy: {
							...updatedData.createdBy,
							displayName: newDisplayName,
						},
					}
				}

				if (data.comments && Array.isArray(data.comments)) {
					const updatedComments = data.comments.map((comment) => {
						if (comment.id === userId) {
							return {
								...comment,
								displayName: newDisplayName,
							}
						}
						return comment
					})

					updatedData = {
						...updatedData,
						comments: updatedComments,
					}
				}

				if (!isEqual(data, updatedData)) {
					const ref = projectFirestore.collection(collection).doc(doc.id)
					batch.update(ref, updatedData)
				}
			})

			await batch.commit()
		} catch (error) {
			console.error('Error updating displayName:', error)
		}
	}

	return { documents, error, updateDisplayName }
}
