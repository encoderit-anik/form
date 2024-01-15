import { useUsersContext } from '@/context/UsersContext'
import Avatar from './Avatar'

// styles
import './OnlineUsers.css'

export default function OnlineUsers() {
	const { users } = useUsersContext()
	return (
		<div className="user-list">
			<h2>all Users</h2>
			{/* {error && <div className="error">{error}</div>} */}
			{users.map((user, index) => (
				<div key={index} className="user-list-item">
					{user.online && <span className="online-user"></span>}
					<span>{user.displayName}</span>
					<Avatar src={user.photoURL} />
				</div>
			))}
		</div>
	)
}
