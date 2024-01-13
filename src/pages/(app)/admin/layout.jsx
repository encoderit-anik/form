import { useAuthContext } from '@/hooks/useAuthContext'
import { Outlet, Navigate } from 'react-router-dom'

export const Component = () => {
	const { user } = useAuthContext()
	if (!user.isAdmin) return <Navigate to="/" />
	return <Outlet />
}
