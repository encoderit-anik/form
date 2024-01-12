import { toUser } from '@/utils/toUser'
import { useEffect } from 'react'
import { Auth, Users } from '@/firebase/config'

export const useOnAuthStateChanged = (currentUser = {}, callback = () => {}) => {
	useEffect(() => {
		return Auth.onAuthStateChanged((user) => {
			if (!user) return callback(null)
			callback(
				toUser({
					...currentUser,
					...user,
					ref: user,
				})
			)
			Users.doc(user.uid)
				.get()
				.then((snapshot) => {
					callback(
						toUser({
							...snapshot.data(),
							ref: user,
						})
					)
				})
		})
	}, [])
}
