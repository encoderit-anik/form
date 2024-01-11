import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
// styles
import './App.css'

// pages and components
import Form from '@/pages/(app)/form/Form'
import Create from '@/pages/(app)/create/Create'
import Login from '@/pages/(auth)/login/Login'
import Question from '@/pages/(app)/question/Question'
import Signup from '@/pages/(auth)/signup/Signup'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import OnlineUsers from '@/components/OnlineUsers'
import Profile from '@/pages/(app)/profile/Profile'
import ContactUs from '@/pages/(app)/contactus/ContactUs'
import ChangeEmail from '@/pages/(app)/profile/ChangeEmail'
import ChangeName from '@/pages/(app)/profile/ChangeName'
import ChangePassword from '@/pages/(app)/profile/ChangePassword'
import ChangePhoto from '@/pages/(app)/profile/ChangePhoto'
import Chat from '@/pages/(app)/chat/Chat'

function OldApp() {
	const { user, authIsReady } = useAuthContext()

	return (
		<div className="App">
			{authIsReady && (
				<BrowserRouter>
					{user && <Sidebar />}
					<div className="container">
						<Navbar />
						<Switch>
							<Route exact path="/">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <Form />}
							</Route>
							<Route path="/create">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <Create />}
							</Route>
							<Route path="/questions/:id">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <Question />}
							</Route>
							<Route path="/login">
								{/* {user && <Redirect to="/" />} */}
								{!user && <Login />}
							</Route>
							<Route path="/chat">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <Chat />}
							</Route>
							<Route path="/profile">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <Profile />}
							</Route>
							<Route path="/changeemail">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <ChangeEmail />}
							</Route>
							<Route path="/changename">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <ChangeName />}
							</Route>
							<Route path="/changepassword">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <ChangePassword />}
							</Route>

							<Route path="/changephoto">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <ChangePhoto />}
							</Route>

							<Route path="/contactus">
								{/* {!user && <Redirect to="/login" />} */}
								{user && <ContactUs />}
							</Route>

							<Route path="/signup">
								{/* {user && <Redirect to="/" />} */}
								{!user && <Signup />}
							</Route>
						</Switch>
					</div>
					{user && <OnlineUsers />}
				</BrowserRouter>
			)}
		</div>
	)
}

export default OldApp
