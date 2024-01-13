import { useEffect } from 'react'
import { Auth, Users } from '@/firebase/config'

export const useOnAuthStateChanged = (callback) => {
	useEffect(() => {
		return Auth.onAuthStateChanged((user) => {
			if (!user) return callback(null)
			Users.doc(user.uid)
				.get()
				.then((snapshot) => {
					if (!snapshot.exists) {
						return
						// return Auth.signOut()
					}

					const data = snapshot.data()
					if (data.isBlocked || data.deletedAt) {
						return Auth.signOut()
					}

					callback({
						uid: user.uid,
						ref: user,
						...data,
					})
				})
		})
	}, [])
}
