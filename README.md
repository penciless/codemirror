# CodeMirror 6 Bundle

> Bundle CodeMirror 6 thành các file JS độc lập để nhúng vào web thuần (không cần build tool).

## Cấu trúc dự án

```
codemirror/
├── src/
│   ├── index.js                  ← Entry point core, expose CodeMirrorEditor
│   ├── core/
│   │   ├── extensions.js         ← Danh sách extension mặc định (tuỳ chỉnh tại đây)
│   │   └── theme.js              ← Theme mặc định (dark)
│   └── languages/
│       ├── lang-javascript.js    ← JS/TS/JSX/TSX pack
│       ├── lang-css.js           ← CSS pack
│       └── lang-html.js          ← HTML pack (embedded JS/CSS)
├── dist/                         ← Output sau khi build
│   ├── codemirror-core.js
│   ├── lang-javascript.js
│   ├── lang-css.js
│   └── lang-html.js
├── demo/
│   └── index.html                ← Demo tương tác
├── rollup.config.js              ← Build config (thêm language mới tại đây)
├── vite.config.js                ← Dev server config
└── package.json
```

## Scripts

```bash
npm run build       # Build production (minified)
npm run build:dev   # Build development (có sourcemap, không minify)
npm run dev         # Dev server → http://localhost:5173/demo/index.html
```

## Cách nhúng vào web

```html
<!-- 1. Core (bắt buộc, load trước) -->
<script src="codemirror-core.js"></script>

<!-- 2. Language packs (load tuỳ theo nhu cầu) -->
<script src="lang-javascript.js"></script>
<script src="lang-css.js"></script>
<script src="lang-html.js"></script>

<div id="editor"></div>

<script>
  const editor = CodeMirrorEditor.create(document.getElementById('editor'), {
    language: 'javascript',
    doc: 'console.log("Hello!")',
    onChange(update) {
      console.log('changed:', update.state.doc.toString());
    },
  });
</script>
```

## API

### `CodeMirrorEditor.create(element, options)`

| Option | Type | Mô tả |
|--------|------|-------|
| `language` | `string` | Tên ngôn ngữ: `'javascript'`, `'typescript'`, `'jsx'`, `'tsx'`, `'css'`, `'html'` |
| `doc` | `string` | Nội dung khởi tạo |
| `theme` | `Extension` | Theme tuỳ chỉnh (mặc định: dark theme có sẵn) |
| `extensions` | `Extension[]` | Extension bổ sung |
| `readOnly` | `boolean` | Chế độ chỉ đọc |
| `onChange` | `(update) => void` | Callback khi nội dung thay đổi |

### Instance methods

```js
editor.getValue()           // → string: nội dung hiện tại
editor.setValue(code)       // set nội dung mới
editor.setLanguage(name)    // đổi ngôn ngữ runtime (không reload)
editor.setTheme(extension)  // đổi theme runtime
editor.setReadOnly(bool)    // bật/tắt chỉ đọc
editor.focus()
editor.destroy()
editor.view                 // EditorView gốc (CodeMirror API đầy đủ)
```

## Thêm language mới

1. Cài package:
   ```bash
   npm install --save-dev @codemirror/lang-python
   ```

2. Tạo `src/languages/lang-python.js`:
   ```js
   import { python } from '@codemirror/lang-python';
   window.__CMLanguages = window.__CMLanguages || {};
   window.__CMLanguages['python'] = (options = {}) => python(options);
   ```

3. Thêm vào `rollup.config.js`:
   ```js
   const LANGUAGE_ENTRIES = [
     // ... existing entries ...
     {
       input: 'src/languages/lang-python.js',
       output: 'dist/lang-python.js',
       name: '__CM_LangPython',
     },
   ];
   ```

4. Build: `npm run build`

5. Nhúng: `<script src="lang-python.js"></script>`

## Tuỳ chỉnh extension

Chỉnh sửa [`src/core/extensions.js`](src/core/extensions.js) để bật/tắt tính năng:

- Tắt line numbers: xoá `lineNumbers()`
- Tắt Tab-to-indent: xoá `indentWithTab` khỏi keymap
- Tắt autocompletion: xoá `autocompletion()`
- v.v.

## Tuỳ chỉnh theme

Chỉnh sửa [`src/core/theme.js`](src/core/theme.js) hoặc truyền theme vào `create()`:

```js
import { oneDark } from '@codemirror/theme-one-dark'; // ví dụ

const editor = CodeMirrorEditor.create(el, {
  theme: oneDark,
  language: 'javascript',
});
```
