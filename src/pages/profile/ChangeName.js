import React, { useState } from 'react';
import './UpdateProfile.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { projectFirestore } from '../../firebase/config';
import { useHistory } from 'react-router-dom';
export default function ChangeName() {
  const [newName, setNewName] = useState('');
  const {  updateDisplayName } = useCollection('questions');
  const { user } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newName.trim() === '') {
      setErrorMessage('Name cannot be empty');
      return;
    }

    try {
      // Update displayName in the 'questions' collection
      await updateDisplayName(user.uid, newName);

      // Update displayName in the 'users' collection
      const userRef = projectFirestore.collection('users').doc(user.uid);
      await userRef.update({ displayName: newName });


      console.log('Updating profile in authentication...');
      await user.updateProfile({
        displayName: newName || user.displayName,
      });
      setErrorMessage(null);
      setNewName('');
      history.push('/profile');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      setErrorMessage('An error occurred while updating the name');
    }
  };


  return (
    <div className="update-profile">
      <h3>Update Your Name</h3>
      <form onSubmit={handleSubmit} className="update-form">
        <input
          type="text"
          placeholder="New Name"
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="btn">Update</button>
      </form>
      {errorMessage&&<p className="error">{errorMessage}</p>}
    </div>
  );
}