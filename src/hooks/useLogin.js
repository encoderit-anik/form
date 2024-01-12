import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { toUser } from '@/utils/toUser'

export const useLogin = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { setUser } = useAuthContext()

	const login = async (email, password) => {
		setError(null)
		setIsPending(true)

		try {
			// login
			const res = await projectAuth.signInWithEmailAndPassword(email, password)

			// we must do that after we Logged in to get the id
			// update online status

			projectFirestore.collection('users').doc(res.user.uid).update({ online: true })

			// dispatch login action
			setUser(toUser(res.user))

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

	return { login, isPending, error }
}
