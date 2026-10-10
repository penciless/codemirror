/**
 * rollup.config.js
 *
 * Build ra các file IIFE độc lập trong dist/:
 *   dist/codemirror-core.js       — core editor (expose window.__CM = { state, view, language, ... })
 *   dist/lang-javascript.js       — JS/TS/JSX/TSX language pack
 *   dist/lang-css.js              — CSS language pack
 *   dist/lang-html.js             — HTML language pack
 *
 * Chiến lược:
 *   - Core bundle các module CM chính và expose ra window.__CM
 *   - Language packs externalize các module CM, lấy từ window.__CM
 *   → Tránh duplicate code, tránh instanceof conflict
 *
 * Thêm language mới:
 *   1. Tạo src/languages/lang-<name>.js
 *   2. Thêm entry vào LANGUAGE_ENTRIES bên dưới
 *   3. Chạy: npm run build
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const isDev = process.env.NODE_ENV === 'development';

// ─── Shared plugins ────────────────────────────────────────────────────────────
function makePlugins() {
  return [
    resolve({ browser: true }),
    commonjs(),
    ...(isDev ? [] : [terser({ compress: { drop_console: false } })]),
  ];
}

// ─── Các module CM được expose ra window.__CM từ core bundle ──────────────────
// Language packs sẽ externalize những module này, lấy từ globals bên dưới.
const CM_EXTERNALS = {
  // CodeMirror core packages
  '@codemirror/state':        'window.__CM.state',
  '@codemirror/view':         'window.__CM.view',
  '@codemirror/language':     'window.__CM.language',
  '@codemirror/commands':     'window.__CM.commands',
  '@codemirror/search':       'window.__CM.search',
  '@codemirror/autocomplete': 'window.__CM.autocomplete',
  '@codemirror/lint':         'window.__CM.lint',
  // Lezer packages (phải dùng cùng instance với core để tránh instanceof conflict)
  '@lezer/common':            'window.__CM.lezerCommon',
  '@lezer/highlight':         'window.__CM.lezerHighlight',
  '@lezer/lr':                'window.__CM.lezerLr',
};

// ─── Danh sách language entries — thêm ngôn ngữ mới vào đây ─────────────────
const LANGUAGE_ENTRIES = [
  {
    input: 'src/languages/lang-javascript.js',
    output: 'dist/lang-javascript.js',
    name: '__CM_LangJS',
  },
  {
    input: 'src/languages/lang-css.js',
    output: 'dist/lang-css.js',
    name: '__CM_LangCSS',
  },
  {
    input: 'src/languages/lang-html.js',
    output: 'dist/lang-html.js',
    name: '__CM_LangHTML',
  },
];

// ─── Build configs ─────────────────────────────────────────────────────────────

export default [
  // ── Core bundle ──────────────────────────────────────────────────────────────
  // Bundle TẤT CẢ các module CM vào một file, expose ra window.__CM và window.CodeMirrorEditor
  {
    input: 'src/index.js',
    output: {
      file: 'dist/codemirror-core.js',
      format: 'iife',
      name: 'CodeMirrorEditor',
      sourcemap: isDev,
      // Không có externals — bundle tất cả vào core
    },
    plugins: makePlugins(),
  },

  // ── Language pack bundles ─────────────────────────────────────────────────────
  // Mỗi pack externalize các module CM (lấy từ window.__CM do core expose)
  ...LANGUAGE_ENTRIES.map(({ input, output, name }) => ({
    input,
    output: {
      file: output,
      format: 'iife',
      name,
      sourcemap: isDev,
      globals: CM_EXTERNALS,   // khai báo các external → global mapping
    },
    // Khai báo external để rollup không bundle lại
    external: Object.keys(CM_EXTERNALS),
    plugins: makePlugins(),
  })),
];
