import { defineConfig } from 'vite'

import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
	base: './',
	plugins: [react()],
	server: {
		open: true,
		port: 3000,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
