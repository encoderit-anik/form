//styles
import './QuestionsList.css'

import { Link } from 'react-router-dom'
import React, { useCallback } from 'react'
import Avatar from './Avatar'
import IconButton from './base/IconButton'
import { useAuthContext } from '@/hooks/useAuthContext'

export default function QuestionsList({ questions }) {
	const { user } = useAuthContext()

	const truncateString = (str, maxLength) => {
		if (str.length > maxLength) {
			return str.substring(0, maxLength) + '...'
		}
		return str
	}

	const onDeleteQuestion = useCallback(async (event, question) => {
		event.preventDefault()
		event.stopPropagation()
		if (confirm(`Are you sure delete this question?`)) {
			question.doc.ref.delete()
		}
	}, [])

	return (
		<div className="question-list pb-16">
			{questions.length === 0 && <p>No Questions yet!</p>}
			{questions.map((question) => (
				<Link to={`/questions/${question.id}`} key={question.id} className="group relative">
					<h4> {question.category}</h4>
					<h5>Question : {truncateString(question.details, 22)}</h5>
					<div className="created-by">
						<ul>
							<li>
								<Avatar src={question.createdBy.photoURL} />
							</li>
						</ul>
						<p>uploaded in {question.createdAt.toDate().toDateString()}</p>
					</div>
					{user.isAdmin && (
						<IconButton
							icon="bx:trash"
							className="transition-transform duration-300 transform scale-0 group-hover:scale-100 absolute right-2 bottom-2"
							onClick={(e) => onDeleteQuestion(e, question)}
						/>
					)}
				</Link>
			))}
		</div>
	)
}
