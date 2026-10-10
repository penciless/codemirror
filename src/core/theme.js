/**
 * theme.js
 * Theme mặc định cho editor.
 * Thay thế file này để áp dụng theme khác (One Dark, Dracula, v.v.).
 */

import { EditorView } from '@codemirror/view';

/**
 * Base theme — chỉ định các biến CSS cơ bản.
 * Override bằng cách truyền `theme` vào createEditor({ theme: myTheme }).
 */
export const baseTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
    height: '100%',
  },
  '.cm-content': {
    caretColor: '#528bff',
    padding: '8px 0',
  },
  '.cm-cursor': {
    borderLeftColor: '#528bff',
  },
  '.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: '#3d4c6a',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: '#5c6370',
    border: 'none',
    minWidth: '40px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 4px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
    color: '#abb2bf',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#667',
  },
  '.cm-tooltip': {
    border: '1px solid #3a3a3a',
    backgroundColor: '#252525',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
    backgroundColor: '#2c313a',
  },
}, { dark: true });
