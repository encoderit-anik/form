import React, { useState } from 'react'
import './UpdateProfile.css'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useCollection } from '@/hooks/useCollection'
import { Users, projectFirestore } from '@/firebase/config'
import { useNavigate } from 'react-router-dom'
export const Component = () => {
	const [newName, setNewName] = useState('')
	const { updateDisplayName } = useCollection('questions')
	const { user } = useAuthContext()
	const [errorMessage, setErrorMessage] = useState(null)
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (newName.trim() === '') {
			setErrorMessage('Name cannot be empty')
			return
		}

		try {
			// Update displayName in the 'questions' collection
			await updateDisplayName(user.uid, newName)

			// Update displayName in the 'users' collection
			await Users.doc(user.uid).update({
				displayName: newName,
				updatedAt: Date.now(),
			})

			console.log('Updating profile in authentication...')
			await user.ref.updateProfile({
				displayName: newName || user.displayName,
			})
			setErrorMessage(null)
			setNewName('')
			navigate('/profile')
			setTimeout(() => {
				window.location.reload()
			}, 300)
		} catch (error) {
			console.log(error)
			setErrorMessage('An error occurred while updating the name')
		}
	}

	return (
		<div className="update-profile">
			<h3>Update Your Name</h3>
			<form onSubmit={handleSubmit} className="update-form">
				<input
					type="text"
					placeholder="New Name"
					required
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
				/>
				<button type="submit" className="btn">
					Update
				</button>
			</form>
			{errorMessage && <p className="error">{errorMessage}</p>}
		</div>
	)
}
