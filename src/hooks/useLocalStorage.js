import { useEffect, useState } from 'react'

export const useLocalStorage = (key) => {
	const [state, setState] = useState(() => {
		const v = localStorage.getItem(key)
		if (v) {
			try {
				const p = JSON.parse(v)
				return p
			} catch (_) {
				//
			}
		}
		return null
	})

	useEffect(() => {
		if (state) localStorage.setItem(key, JSON.stringify(state))
		else localStorage.removeItem(key)
	}, [state])

	return [state, setState]
}
