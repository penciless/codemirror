/**
 * vite.config.js
 *
 * Build ra các file trong dist/:
 *   dist/codemirror-core.js       — core editor (không có language)
 *   dist/lang-javascript.js       — JS/TS/JSX/TSX language pack
 *   dist/lang-css.js              — CSS language pack
 *   dist/lang-html.js             — HTML language pack
 *
 * Chiến lược:
 *   - Mỗi file là IIFE độc lập, không cần module loader
 *   - Mỗi language pack bundle đầy đủ code cần thiết (không external core)
 *   - Nhúng vào web chỉ cần <script src="..."> theo thứ tự
 *
 * Thêm language mới:
 *   1. Tạo src/languages/lang-<name>.js
 *   2. Thêm vào mảng LANGUAGE_ENTRIES bên dưới
 *   3. Chạy: npm run build
 */

import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Danh sách language entries — thêm ngôn ngữ mới vào đây ─────────────────
const LANGUAGE_ENTRIES = [
  {
    name: 'lang-javascript',
    entry: 'src/languages/lang-javascript.js',
    globalName: '__CM_LangJS',          // tên IIFE global (nội bộ, không cần dùng)
  },
  {
    name: 'lang-css',
    entry: 'src/languages/lang-css.js',
    globalName: '__CM_LangCSS',
  },
  {
    name: 'lang-html',
    entry: 'src/languages/lang-html.js',
    globalName: '__CM_LangHTML',
  },
];

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: isDev,
      minify: isDev ? false : 'esbuild',

      rollupOptions: {
        // ── Multi-entry ──
        input: {
          'codemirror-core': path.resolve(__dirname, 'src/index.js'),
          ...Object.fromEntries(
            LANGUAGE_ENTRIES.map(({ name, entry }) => [
              name,
              path.resolve(__dirname, entry),
            ])
          ),
        },

        output: [
          // Output duy nhất: IIFE, mỗi entry thành file riêng
          {
            format: 'iife',
            entryFileNames: '[name].js',
            // Disable code splitting — mỗi entry bundle độc lập hoàn toàn
            chunkFileNames: '[name]-chunk.js',
            // Tên global cho core bundle
            name: 'CodeMirrorEditor',
            // Tắt hashing
            assetFileNames: '[name][extname]',
          },
        ],
      },
    },

    server: {
      open: '/demo/index.html',
      port: 5173,
    },
  };
});
