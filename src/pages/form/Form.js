
import { useCollection } from '../../hooks/useCollection'
import './Form.css'
import React from 'react'
import QuestionsList from '../../components/QuestionsList'
import FormFilter from './FormFilter'
import { useState } from 'react'


export default function Form() {
  const {documents,error} = useCollection('questions')
  
  const [currentFilter, setCurrentFilter] = useState('all')
  

  const changeFilter = (newFilter)=>{
    setCurrentFilter(newFilter)
  }
  
  const questions = documents ? documents.filter((document) => {
    switch (currentFilter) {
      case 'all':
        return true;
      case 'Java':
      case 'C#':
      case 'Python':
      case 'C++':
        return document.category === currentFilter;
  
      default:
        return true;
    }
  }) : null;
  

  return (
    <div >
      <h2 className="page-title">Form</h2>
      {error && <p className='error'>{error}</p>}
      {documents &&( 
      <FormFilter currentFilter={currentFilter} changeFilter={changeFilter} 
      />)}
      {questions && <QuestionsList questions={questions}/> }
      
    </div>
  )
}
