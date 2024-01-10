import {NavLink} from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import './Sidebar.css'


import DashboardIcon from '../assets/dashboard_icon.svg'
import addIcon from '../assets/add_icon.svg'
import profileIcon from '../assets/icons8-account-24.png'
import contactusIcon from '../assets/icons8-contact-24.png'
import chatIcon from '../assets/icons8-chat-30.png'
import Avatar from './Avatar'
export default function Sidebar() {
  const {user} = useAuthContext()

  return (
    <div className='sidebar'>
        <div className="sidebar-content">
           <div className="user">
             <Avatar src={user.photoURL} />
             <p>Hey {user.displayName}</p>
            </div>
        <nav className="links">
            <ul>
              <li>
                <NavLink to ='/profile'>
                  <img src={profileIcon} alt='profile icon'/>
                  <span>Profile</span>
                </NavLink>
              </li>
                <li>
            <NavLink exact to='/'>
              <img src={DashboardIcon} alt='dashboard icon'/>
              <span>Form</span>
            </NavLink>
                </li>
                <li>
            <NavLink to='/create'>
              <img src={addIcon} alt='add question icon'/>
              <span>New Question</span>
            </NavLink>
                </li>
                <li>
                <NavLink to ='/contactus'>
                  <img src={contactusIcon} alt='contact icon'/>
                  <span>Contact Us</span>
                </NavLink>
              </li>
              <li>
                <NavLink to ='/chat'>
                  <img src={chatIcon} alt='chat icon'/>
                  <span>Chat</span>
                </NavLink>
              </li>
            </ul>
        </nav>
        </div>

    </div>
  )
}
