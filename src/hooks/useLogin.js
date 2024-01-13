import { Users, projectAuth } from '../firebase/config'
import { useState, useEffect } from 'react'

export const useLogin = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)

	const login = async (email, password) => {
		setError(null)
		setIsPending(true)

		try {
			const res = await projectAuth.signInWithEmailAndPassword(email, password)

			Users.doc(res.user.uid).update({
				online: true,
				updatedAt: true,
			})

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
