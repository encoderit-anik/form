import { useAuthContext } from '@/hooks/useAuthContext'
import './UpdateProfile.css'
import React, { useState } from 'react'
import { Users, projectAuth } from '@/firebase/config'
import { useNavigate } from 'react-router-dom'

export const Component = () => {
	const [newEmail, setNewEmail] = useState('')
	const [errorMessage, setErrorMessage] = useState(null)
	const { user } = useAuthContext()
	const navigate = useNavigate()
	const handleSubmit = async (e) => {
		e.preventDefault()
		setErrorMessage(null)

		if (newEmail !== '') {
			if (newEmail === user.email) {
				console.log('New email is the same as the current email')
				setErrorMessage('cant use the same email')
				return // Do not proceed with the update
			}

			// Check if the new email already exists in Firebase
			try {
				const emailExists = await projectAuth.fetchSignInMethodsForEmail(newEmail)
				if (emailExists.length > 0) {
					console.log('Email already in use')
					setErrorMessage('Email already in use')
					return // Do not proceed with the update
				}
			} catch (error) {
				setErrorMessage(error)
				console.error('Email check error:', error.message)
			}

			setErrorMessage(null)

			try {
				if (newEmail !== '' && newEmail !== user.email) {
					console.log('Updating email in authentication...')
					await Users.doc(user.uid).update({
						email: newEmail,
						updatedAt: Date.now(),
					})
					await user.ref.updateEmail(newEmail)
					console.log('updated!')
					navigate('/profile')
				}
			} catch (error) {
				console.error('Error updating profile in authentication:', error.message)
			}
		}
	}
	return (
		<div className="update-profile">
			<h3>Change Your Email</h3>
			<form className="update-form">
				<input
					type="email"
					placeholder="New Email"
					required
					value={newEmail}
					onChange={(e) => setNewEmail(e.target.value)}
				/>
				<button onClick={handleSubmit} className="btn">
					Update
				</button>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	)
}
