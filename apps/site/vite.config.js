import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '/opt/arvumi/svelte-adapter/index.js';
export default defineConfig({ ssr: { external: ['@arvumi-fixture/data'] }, plugins: [sveltekit({ adapter: adapter() })] });
