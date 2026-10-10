/**
 * lang-javascript.js
 * Language pack cho JavaScript / TypeScript.
 *
 * Cách dùng (nhúng file này sau codemirror-core.js):
 *   <script src="dist/lang-javascript.js"></script>
 *
 * Sau đó tạo editor:
 *   CodeMirrorEditor.create(el, { language: 'javascript' })
 *   CodeMirrorEditor.create(el, { language: 'typescript' })  // cũng được
 *   CodeMirrorEditor.create(el, { language: 'jsx' })
 */

import { javascript } from '@codemirror/lang-javascript';

/**
 * Đăng ký language pack vào global registry.
 * Hàm `javascript()` trả về Extension, nhận tuỳ chọn:
 *   - jsx: true/false (bật JSX syntax)
 *   - typescript: true/false (bật TypeScript)
 */
window.__CMLanguages = window.__CMLanguages || {};

window.__CMLanguages['javascript'] = (options = {}) =>
  javascript({ jsx: false, typescript: false, ...options });

window.__CMLanguages['typescript'] = (options = {}) =>
  javascript({ jsx: false, typescript: true, ...options });

window.__CMLanguages['jsx'] = (options = {}) =>
  javascript({ jsx: true, typescript: false, ...options });

window.__CMLanguages['tsx'] = (options = {}) =>
  javascript({ jsx: true, typescript: true, ...options });
