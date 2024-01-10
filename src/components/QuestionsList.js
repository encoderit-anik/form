//styles
import './QuestionsList.css'

import {Link} from 'react-router-dom'
import React from 'react'
import Avatar from './Avatar'

export default function QuestionsList({questions}) {
  
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  };

  return (
    <div className='question-list'> 
        {questions.length === 0 && <p>No Questions yet!</p>}
        {questions.map( question => (
            <Link to={`/questions/${question.id}`} key={question.id}>
              <h4> {question.category}</h4>
               
               <h5>Question : {truncateString(question.details, 22)}</h5>
              <div className='created-by'>
                <ul>
                  <li>
                    <Avatar src={question.createdBy.photoURL}/>
                  </li>
                </ul>
                <p>uploaded in {question.createdAt.toDate().toDateString()}</p>
              </div>
            </Link>
        ))}
    </div>
  )
}
