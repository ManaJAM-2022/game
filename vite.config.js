import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/game' : '/',
  build: {
    rollupOptions: {
      plugins: [
        //  Toggle the booleans here to enable / disable Phaser 3 features:
        replace({
          'typeof CANVAS_RENDERER': "'true'",
          'typeof WEBGL_RENDERER': "'true'",
          'typeof EXPERIMENTAL': "'true'",
          'typeof PLUGIN_CAMERA3D': "'false'",
          'typeof PLUGIN_FBINSTANT': "'false'",
          'typeof FEATURE_SOUND': "'true'",
        }),
      ],
    },
  },
});
