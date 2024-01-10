import './Create.css'
import React, {useState } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import {useFirestore} from '../../hooks/useFirestore'
import {useHistory} from 'react-router-dom'

const categories = [
  { value: 'Java', label: 'Java' },
  { value: 'Python', label: 'Python' },
  { value: 'C#', label: 'C#' },
  { value: 'C++', label: 'C++' },
]

export default function Create() {
  const history = useHistory()
  const {addDocument,response} = useFirestore('questions')
  const {user} = useAuthContext()

  const [details, setDetails] = useState('')
  const [category, setCategory] = useState('')
  const [formError , setFormError]= useState(null)


  

  const handleSumbit = async (e) =>{
    e.preventDefault()
    setFormError(null)
   if(!category){
    setFormError("Please Select a Category")
    
    return
   }

 
   const createdBy = {
    displayName : user.displayName,
    photoURL : user.photoURL,
    id : user.uid
   }

   const question = {
    details,
    category:category.value,
    comments:[],
    createdBy
   }
 await addDocument(question)
 if(!response.error){
  history.push('/')
 }
  }
  return (
    <div className='create-form'>
      <h2 className='page-title'>Ask a New Question</h2>
      <form onSubmit={handleSumbit}>
      <label>
     <span>Question : </span>
     <textarea 
     required
     type="text"
     onChange={(e)=>setDetails(e.target.value)}
     value={details}
      >
     </textarea>
      </label>
      <label>
        <span>Programming Languages : </span>
        <Select
        onChange={(option)=> setCategory(option)}
        options={categories}
        />
      </label>
     
      <button className="btn">Add Question</button>
      {formError && <p className='error'>{formError}</p>}
      </form>
      
    </div>
  )
}
