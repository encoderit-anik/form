import './Create.css'
import React, { useState } from 'react'
import Select from 'react-select'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useFirestore } from '@/hooks/useFirestore'
import { useNavigate } from 'react-router-dom'
import { useCollection2 } from '@/hooks/useCollection2'

export const Component = () => {
	const navigate = useNavigate()

	const { data: languages } = useCollection2('languages')
	const { addDocument, response } = useFirestore('questions')
	const { user } = useAuthContext()

	const [details, setDetails] = useState('')
	const [category, setCategory] = useState('')
	const [formError, setFormError] = useState(null)

	const handleSumbit = async (e) => {
		e.preventDefault()
		setFormError(null)
		if (!category) {
			setFormError('Please Select a Category')

			return
		}

		const createdBy = {
			displayName: user.displayName,
			photoURL: user.photoURL,
			id: user.uid,
		}

		const question = {
			details,
			category: category.value,
			comments: [],
			createdBy,
		}
		await addDocument(question)
		if (!response.error) {
			navigate('/')
		}
	}
	return (
		<div className="create-form">
			<h2 className="page-title">Ask a New Question</h2>
			<form onSubmit={handleSumbit}>
				<label>
					<span>Question : </span>
					<textarea
						required
						type="text"
						onChange={(e) => setDetails(e.target.value)}
						value={details}
					></textarea>
				</label>
				<label>
					<span>Programming Languages : </span>
					<Select
						onChange={(option) => setCategory(option)}
						options={languages}
						getOptionLabel={(v) => v.name}
					/>
				</label>

				<button className="btn">Add Question</button>
				{formError && <p className="error">{formError}</p>}
			</form>
		</div>
	)
}
