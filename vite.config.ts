import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
			generatedRouteTree: './src/route-tree.gen.ts',
			routesDirectory: './src/pages',
		}),
		react(),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
})
