import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss';

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    server: {
        proxy: {
            '/api': {
                target: 'https://generativelanguage.googleapis.com',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});