import React, { useMemo } from 'react'
import FormFilter from './FormFilter'
import QuestionsList from '@/components/QuestionsList'

import { useState } from 'react'
import { useCollection } from '@/hooks/useCollection'

import './Form.css'

export const Component = () => {
	const { documents, error } = useCollection('questions', null, ['createdAt', 'desc'])
	const [currentFilter, setCurrentFilter] = useState('all')
	const changeFilter = (v) => setCurrentFilter(v)

	const questions = useMemo(() => {
		if (!documents) return
		if (currentFilter === 'all') return documents
		return documents.filter((doc) => {
			return doc.category === currentFilter
		})
	}, [documents, currentFilter])

	return (
		<div>
			<h2 className="page-title">Form</h2>
			{error && <p className="error">{error}</p>}
			{documents && <FormFilter currentFilter={currentFilter} changeFilter={changeFilter} />}
			{questions && <QuestionsList questions={questions} />}
		</div>
	)
}
