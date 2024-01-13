import React from 'react'
import router from './router'
import ReactDOM from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'

import './tailwind.css'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<AuthContextProvider>
		<div className="App">
			<RouterProvider router={router} />
		</div>
	</AuthContextProvider>
)
