import path from 'path';
import type { UserConfig as UC } from 'vite';

const config: UC = {
  root: 'src/',
  publicDir: path.resolve(__dirname, 'public'),
  base: '/systems/mythic/',
  server: {
    port: 30001,
    open: true,
    proxy: {
      '^(?!/systems/mythic)': 'http://localhost:30000/',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true,
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    brotliSize: true,
    terserOptions: {
      mangle: false,
      keep_classnames: true,
      keep_fnames: true,
    },
    lib: {
      name: 'mythic',
      entry: path.resolve(__dirname, 'src/mythic.ts'),
      formats: ['es'],
      fileName: 'mythic',
    },
  },
};

export default config;
