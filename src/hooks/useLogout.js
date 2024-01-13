import { useEffect, useState } from 'react'
import { Users, projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { user, setUser } = useAuthContext()

	const logout = async () => {
		setError(null)
		setIsPending(true)

		try {
			// we must do that before we make the use log out from firebase to get the id
			// update online status
			const { uid } = user
			await Users.doc(uid).update({
				online: false,
				updatedAt: Date.now(),
			})

			// sign the user out
			await projectAuth.signOut()

			// dispatch logout action
			setUser(null)

			// update state
			if (!isCancelled) {
				setIsPending(false)
				setError(null)
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
			}
		}
	}

	useEffect(() => {
		return () => setIsCancelled(true)
	}, [])

	return { logout, error, isPending }
}
