import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '/opt/arvumi/svelte-adapter/index.js';
export default defineConfig({ plugins: [sveltekit({ adapter: adapter() })] });
