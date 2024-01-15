import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import { UsersProvider } from '@/context/UsersContext'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import OnlineUsers from '@/components/OnlineUsers'

export const Component = () => {
	const { user } = useAuthContext()
	if (!user) return <Navigate replace to="/login" />

	return (
		<UsersProvider>
			<Sidebar />
			<div className="wrapper flex flex-col relative">
				<Navbar />
				<Outlet />
			</div>
			<OnlineUsers />
		</UsersProvider>
	)
}
