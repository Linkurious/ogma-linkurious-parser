import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    minify: true,
    emptyOutDir: false,
    // Set the output directory to 'dist'
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: (format) => 'index.mjs'
    },
    rollupOptions: {
      external: ['@linkurious/ogma', '@linkurious/rest-client', 'lodash', 'rxjs']
    }
  }
});
