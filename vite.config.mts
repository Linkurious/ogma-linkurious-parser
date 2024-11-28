import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    minify: true,
    emptyOutDir: false,
    sourcemap: true,
    // Set the output directory to 'dist'
    outDir: 'dist',
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'm' : 'c'}js`
    },
    rollupOptions: {
      external: ['@linkurious/ogma', '@linkurious/rest-client', 'lodash', 'rxjs']
    }
  }
});
