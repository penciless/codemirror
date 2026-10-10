/**
 * extensions.js
 * Tập hợp các extension mặc định cho editor.
 * Chỉnh sửa file này để thêm/bớt extension toàn cục.
 */

import { keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor, rectangularSelection, crosshairCursor, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';

/**
 * Bộ extension mặc định — tương đương basicSetup nhưng tách riêng để dễ tuỳ chỉnh.
 * Bạn có thể bỏ comment bất kỳ dòng nào để tắt tính năng tương ứng.
 */
export const defaultExtensions = [
  // --- UI ---
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),

  // --- Editing behaviour ---
  EditorState.allowMultipleSelections.of(true),
  rectangularSelection(),
  crosshairCursor(),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),

  // --- Syntax highlighting ---
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),

  // --- Keymaps (thứ tự quan trọng) ---
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
    indentWithTab,         // Tab để indent (bỏ nếu cần Tab-focus)
  ]),

  // --- History ---
  history(),
];
