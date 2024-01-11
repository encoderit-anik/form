// Profile.js
import './Profile.css'
import { useAuthContext } from '@/hooks/useAuthContext'
import { Link } from 'react-router-dom'

export const Component = () => {
	const { user } = useAuthContext()
	return (
		<div className="profile-page">
			<div className="photo">
				<img src={user.photoURL} alt="Profile" />
			</div>
			<div className="profile-info">
				<h3> {user.displayName}</h3>
				<br />
				<p>Email: {user.email}</p>
			</div>
			<div className="button-grid">
				<div className="top-buttons">
					<Link to="/changename">
						<button className="btn">Edit Name</button>
					</Link>

					<Link to="/changeemail">
						<button className="btn">Edit Email</button>
					</Link>
				</div>
				<div className="bottom-buttons">
					<Link to="/changepassword">
						<button className="btn">Edit Password</button>
					</Link>
					<Link to="/changephoto">
						<button className="btn">Edit Photo</button>
					</Link>
				</div>
			</div>
		</div>
	)
}
