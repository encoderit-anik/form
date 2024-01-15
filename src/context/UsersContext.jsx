import { createContext, useContext } from 'react'
import { useCollection2 } from '@/hooks/useCollection2'

export const UsersContext = createContext()

export const UsersProvider = ({ children }) => {
	const { data: users } = useCollection2('users', {
		where: ['deletedAt', '==', null],
	})
	return (
		<UsersContext.Provider
			value={{
				users,
			}}
		>
			{children}
		</UsersContext.Provider>
	)
}

export const useUsersContext = () => {
	const context = useContext(UsersContext)
	if (!context) {
		throw Error('useUsersContext must be used inside an UsersProvider')
	}
	return context
}
