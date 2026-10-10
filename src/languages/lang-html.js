/**
 * lang-html.js
 * Language pack cho HTML (bao gồm embedded CSS & JS).
 *
 * Cách dùng (nhúng file này sau codemirror-core.js):
 *   <script src="dist/lang-html.js"></script>
 *
 * Sau đó tạo editor:
 *   CodeMirrorEditor.create(el, { language: 'html' })
 */

import { html } from '@codemirror/lang-html';

window.__CMLanguages = window.__CMLanguages || {};

/**
 * HTML language pack — hỗ trợ embedded JS/CSS, autoclose tags, autocomplete attributes.
 * Tuỳ chọn: matchClosingTags, autoCloseTags, extraTags, extraGlobalAttributes
 */
window.__CMLanguages['html'] = (options = {}) =>
  html({ matchClosingTags: true, autoCloseTags: true, ...options });
