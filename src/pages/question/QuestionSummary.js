import React from 'react'
import Avatar  from '../../components/Avatar'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import {useHistory} from 'react-router-dom'

export default function QuestionSummary({question}) {
   const {deleteDocument} = useFirestore('questions')
   const {user} = useAuthContext()
   const history= useHistory()

   const handleClick = (e) =>{
    deleteDocument(question.id)
    history.push('/')

   }

  return (
    <div >
     <div className="question-summary">
   
        <p className="date">
            Uploaded in {question.createdAt.toDate().toDateString()}
        </p>
        <p className="details">{question.details}</p>
        <h4>Asked By {question.createdBy.displayName} :</h4>
        <div className='question-users'></div>
        <div key={question.createdBy.id}>
            <Avatar src={question.createdBy.photoURL}/>
        </div>
     </div>
     {user.uid === question.createdBy.id && (
     <button className="btn" onClick={handleClick}>Delete Question</button>
      )}
    </div>
  )
}
