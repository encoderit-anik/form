import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import icons8java from '../assets/icons8java.svg';
import messagesIcon from '../assets/icons8-message-32.png';
import './Navbar.css';
import MessageModal from './MessageModal'; // Import the MessageModal component
import { useFirestore } from '../hooks/useFirestore';

export default function Navbar() {
  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);

  const { response } = useFirestore('notifications');
  const unreadNotificationsCount = response.document ? response.document.length : 0;

  const openMessageModal = () => {
    setMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setMessageModalOpen(false);
  };

  return (
    <div className='navbar'>
      <ul>
        <li className="logo">
          <img src={icons8java} alt='form logo'/>
          <span>Java Form</span>
        </li>
        {!user && (
          <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/signup'>Signup</Link></li>
          </>
        )}
              {user && user.uid && (
          <>
            <li>
              <Link to='#' onClick={openMessageModal}>
                <img src={messagesIcon} alt='' />
                {unreadNotificationsCount > 0 && (
                  <span className="notification-indicator">{unreadNotificationsCount}</span>
                )}
              </Link>
            </li>
            <li>
              {!isPending && <button className="btn" onClick={logout}>Logout</button>}
              {isPending && <button className="btn" disabled>Logging out...</button>}
            </li>
          </>
        )}
      </ul>
      {user && user.uid && <MessageModal isOpen={isMessageModalOpen} onClose={closeMessageModal}  />  }
    </div>
  );
}