import { useParams } from 'react-router-dom'
import { useDocument } from '@/hooks/useDocument'
import QuestionSummary from './QuestionSummary'
import './Question.css'
import React from 'react'
import QuestionComments from './QuestionComments'

export const Component = () => {
	const { id } = useParams()
	const { error, document } = useDocument('questions', id)
	if (error) {
		return <div className="error">{error}</div>
	}
	if (!document) {
		return <div className="loading">Loading...</div>
	}

	return (
		<div className="question-details">
			<QuestionSummary question={document} />
			<QuestionComments question={document} />
		</div>
	)
}
