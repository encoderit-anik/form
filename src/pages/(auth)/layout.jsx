import Navbar from '@/components/Navbar'
import { useAuthContext } from '@/hooks/useAuthContext'
import { Outlet, Navigate } from 'react-router-dom'

export const Component = () => {
	const { user } = useAuthContext()
	if (user) return <Navigate replace to="/" />

	return (
		<div className="wrapper">
			<Navbar />
			<Outlet />
		</div>
	)
}
