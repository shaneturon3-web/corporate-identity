import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shaneturon.ca',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
