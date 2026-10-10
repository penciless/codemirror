/**
 * lang-css.js
 * Language pack cho CSS / SCSS / Less.
 *
 * Cách dùng (nhúng file này sau codemirror-core.js):
 *   <script src="dist/lang-css.js"></script>
 *
 * Sau đó tạo editor:
 *   CodeMirrorEditor.create(el, { language: 'css' })
 */

import { css } from '@codemirror/lang-css';

window.__CMLanguages = window.__CMLanguages || {};

/**
 * CSS language pack — hỗ trợ syntax, autocomplete tên thuộc tính/giá trị.
 */
window.__CMLanguages['css'] = (options = {}) => css(options);
