import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    build: {
        outDir: 'public/build', // so Docker can find it
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
