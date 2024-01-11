import { createBrowserRouter } from 'react-router-dom'

export default createBrowserRouter([
	{
		path: '/',
		lazy: () => import('@/pages/(app)/layout'),
		children: [
			{
				index: true,
				lazy: () => import('@/pages/(app)/form/Form'),
			},
			{
				path: 'create',
				lazy: () => import('@/pages/(app)/create/Create'),
			},
			{
				path: 'questions/:id',
				lazy: () => import('@/pages/(app)/question/Question'),
			},
			{
				path: 'chat',
				lazy: () => import('@/pages/(app)/chat/Chat'),
			},
			{
				path: 'profile',
				lazy: () => import('@/pages/(app)/profile/Profile'),
			},
			{
				path: 'changeemail',
				lazy: () => import('@/pages/(app)/profile/ChangeEmail'),
			},
			{
				path: 'changename',
				lazy: () => import('@/pages/(app)/profile/ChangeName'),
			},
			{
				path: 'changepassword',
				lazy: () => import('@/pages/(app)/profile/ChangePassword'),
			},
			{
				path: 'changephoto',
				lazy: () => import('@/pages/(app)/profile/ChangePhoto'),
			},
			{
				path: 'contactus',
				lazy: () => import('@/pages/(app)/contactus/ContactUs'),
			},
		],
	},
	{
		path: '/',
		lazy: () => import('@/pages/(auth)/layout'),
		children: [
			{
				path: 'login',
				lazy: () => import('@/pages/(auth)/login/Login'),
			},
			{
				path: 'signup',
				lazy: () => import('@/pages/(auth)/signup/Signup'),
			},
		],
	},
])
