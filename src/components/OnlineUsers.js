import {useCollection} from '../hooks/useCollection'
import Avatar from './Avatar'
// styles
import './OnlineUsers.css'
import React from 'react'

export default function OnlineUsers() {
    const {error,documents} = useCollection('users')
  return (
    <div className="user-list">
        <h2>all Users</h2>
        {error && <div className='error'>{error}</div>}
        {documents && documents.map(user => (
            <div className='user-list-item' key={user.id}>
               {user.online && <span className='online-user'></span>}
                <span>{user.displayName}</span>
                <Avatar src={user.photoURL}/>
            </div>
        ))}
    </div>
  )
}
