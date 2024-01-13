import { useAuthContext } from '@/hooks/useAuthContext'
import './UpdateProfile.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Component = () => {
	const [newPassword, setNewPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState(null)
	const { user } = useAuthContext()
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setErrorMessage(null)
		if (newPassword !== '') {
			if (newPassword.length < 6) {
				console.log('Password must be at least 6 characters long')
				setErrorMessage('Password must be at least 6 characters long')
				return // Do not proceed with the update
			}
		}
		try {
			await user.ref.updatePassword(newPassword)
			navigate('/profile')
		} catch (error) {
			setErrorMessage(errorMessage.message)
			return
		}
	}
	return (
		<div className="update-profile">
			<h3>Change Your PassWord</h3>
			<form className="update-form">
				<input
					type="password"
					placeholder="New Password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
				<button onClick={handleSubmit} className="btn">
					Update
				</button>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	)
}
