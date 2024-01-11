import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import OnlineUsers from '@/components/OnlineUsers'

export const Component = () => {
	const { user, authIsReady } = useAuthContext()

	if (!authIsReady) return null
	if (!user) return <Navigate replace to="/login" />

	return (
		<>
			<Sidebar />
			<div className="wrapper">
				<Navbar />
				<Outlet />
			</div>
			<OnlineUsers />
		</>
	)
}
