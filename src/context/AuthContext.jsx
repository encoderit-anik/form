import { createContext } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useOnAuthStateChanged } from '@/hooks/useOnAuthStateChanged'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useLocalStorage('user')
	useOnAuthStateChanged((v) => {
		setUser(v)
	})
	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
