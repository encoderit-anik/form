import './UpdateProfile.css'
import React, { useState } from 'react'
import { useAuthContext } from '@/hooks/useAuthContext'
import { Users, projectStorage } from '@/firebase/config'
import { useNavigate } from 'react-router-dom'
import { projectFirestore } from '@/firebase/config'

export const Component = () => {
	const [error, setError] = useState(null)
	const { user } = useAuthContext()
	const [selectedImage, setSelectedImage] = useState(null)
	const [thumbnail, setThumbnail] = useState(null)
	const [thumbnailError, setThumbnailError] = useState(null)
	const navigate = useNavigate()

	const handleFileChange = (e) => {
		setThumbnail(null)
		let selected = e.target.files[0]

		if (!selected) {
			setThumbnailError('Please Select a File')
			return
		}
		if (!selected.type.includes('image')) {
			setThumbnailError('Selected file must be an image')
			return
		}
		if (selected.size > 100000) {
			setThumbnailError('Image File Size Must Be Less Than 100kb')
			return
		}
		setThumbnailError(null)
		setThumbnail(selected)
	}

	const handleFormSubmit = async (e) => {
		e.preventDefault()
		setError(null)

		if (!selectedImage) {
			setError('Select Image')
			return
		}

		try {
			const storageRef = projectStorage.ref(`thumbnails/${user.uid}/${selectedImage.name}`)
			const uploadTask = storageRef.put(selectedImage)

			uploadTask.on('state_changed', null, null, async () => {
				const downloadURL = await storageRef.getDownloadURL()

				await user.ref.updateProfile({
					photoURL: downloadURL,
				})

				// Update users photo URL in the users collection
				await Users.doc(user.uid).update({
					photoURL: downloadURL,
					updatedAt: Date.now(),
				})

				// Update users photo URL in questions collections comment arrays
				const questionsRef = projectFirestore.collection('questions')
				const questionsSnapshot = await questionsRef.get()

				questionsSnapshot.forEach(async (doc) => {
					const questionData = doc.data()
					if (questionData.createdBy.id === user.uid) {
						const updatedCreatedBy = { ...questionData.createdBy, photoURL: downloadURL }
						await questionsRef.doc(doc.id).update({
							createdBy: updatedCreatedBy,
						})
					}

					const updatedComments = questionData.comments.map((comment) => {
						if (comment.id === user.uid) {
							return { ...comment, photoURL: downloadURL }
						}
						return comment
					})

					await questionsRef.doc(doc.id).update({
						comments: updatedComments,
					})
				})
				navigate('/profile')
				setTimeout(() => {
					window.location.reload()
				}, 100)
			})
		} catch (error) {
			setError(error)
		}
		console.log(error, thumbnail)
	}

	return (
		<div className="update-profile">
			<h3>Update Your Photo</h3>
			<form className="update-form">
				<input
					type="file"
					onClick={handleFileChange}
					onChange={(e) => setSelectedImage(e.target.files[0])}
				/>
				<button onClick={handleFormSubmit} className="btn">
					Update
				</button>
			</form>
			{thumbnailError && <div className="error">{thumbnailError}</div>}
		</div>
	)
}
