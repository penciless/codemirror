/**
 * index.js — Entry point cho core bundle (dist/codemirror-core.js)
 *
 * File này:
 *   1. Expose window.__CM — chứa các module CM để language packs dùng chung
 *   2. Expose window.CodeMirrorEditor — API tạo editor
 *
 * Language packs (lang-*.js) externalize các module CM và lấy từ window.__CM,
 * tránh duplicate code và tránh instanceof conflict.
 *
 * API công khai:
 *   const editor = CodeMirrorEditor.create(element, options)
 *   editor.getValue()           — lấy nội dung hiện tại
 *   editor.setValue(code)       — set nội dung
 *   editor.setLanguage(name)    — đổi ngôn ngữ runtime
 *   editor.setTheme(extension)  — đổi theme runtime
 *   editor.setReadOnly(bool)    — bật/tắt chỉ đọc
 *   editor.focus()
 *   editor.destroy()
 *   editor.view                 — truy cập EditorView gốc nếu cần
 */

import * as _state from '@codemirror/state';
import * as _view from '@codemirror/view';
import * as _language from '@codemirror/language';
import * as _commands from '@codemirror/commands';
import * as _search from '@codemirror/search';
import * as _autocomplete from '@codemirror/autocomplete';
import * as _lint from '@codemirror/lint';
import * as _lezerCommon from '@lezer/common';
import * as _lezerHighlight from '@lezer/highlight';
import * as _lezerLr from '@lezer/lr';

import { EditorState, Compartment } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { defaultExtensions } from './core/extensions.js';
import { baseTheme } from './core/theme.js';

// ─── Expose các module CM ra window.__CM ──────────────────────────────────────
// Language packs dùng globals này thay vì bundle lại.
window.__CM = {
  state:          _state,
  view:           _view,
  language:       _language,
  commands:       _commands,
  search:         _search,
  autocomplete:   _autocomplete,
  lint:           _lint,
  lezerCommon:    _lezerCommon,
  lezerHighlight: _lezerHighlight,
  lezerLr:        _lezerLr,
};

// ─── Language registry ────────────────────────────────────────────────────────
// Language packs tự đăng ký vào đây khi được load.
window.__CMLanguages = window.__CMLanguages || {};

// ─── API ───────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} CreateOptions
 * @property {string}   [language]   - Tên ngôn ngữ (cần load language pack tương ứng trước)
 * @property {string}   [doc]        - Nội dung ban đầu
 * @property {*}        [theme]      - Theme extension tuỳ chỉnh
 * @property {Array}    [extensions] - Extension bổ sung
 * @property {boolean}  [readOnly]   - Chỉ đọc
 * @property {Function} [onChange]   - Callback(update) khi nội dung thay đổi
 */

/**
 * Tạo một CodeMirror editor instance.
 *
 * @param {HTMLElement} element
 * @param {CreateOptions} [options]
 */
function create(element, options = {}) {
  const {
    language,
    doc = '',
    theme,
    extensions: extraExtensions = [],
    readOnly = false,
    onChange,
  } = options;

  // Compartments cho phép swap từng phần config mà không rebuild toàn bộ editor
  const languageCompartment = new Compartment();
  const themeCompartment = new Compartment();
  const readOnlyCompartment = new Compartment();

  const langExtension = _resolveLanguage(language);
  const themeExtension = theme ?? baseTheme;

  const state = EditorState.create({
    doc,
    extensions: [
      defaultExtensions,
      languageCompartment.of(langExtension),
      themeCompartment.of(themeExtension),
      readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
      extraExtensions,
      onChange
        ? EditorView.updateListener.of((update) => {
            if (update.docChanged) onChange(update);
          })
        : [],
    ],
  });

  const view = new EditorView({ state, parent: element });

  return {
    /** Truy cập EditorView gốc */
    view,

    /** Lấy nội dung hiện tại */
    getValue() {
      return view.state.doc.toString();
    },

    /** Set nội dung mới */
    setValue(code) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: code },
      });
    },

    /**
     * Đổi ngôn ngữ runtime.
     * Language pack tương ứng phải đã được load.
     * @param {string} name
     * @param {object} [langOptions]
     */
    setLanguage(name, langOptions) {
      const ext = _resolveLanguage(name, langOptions);
      view.dispatch({ effects: languageCompartment.reconfigure(ext) });
    },

    /**
     * Đổi theme runtime.
     * @param {*} themeExt
     */
    setTheme(themeExt) {
      view.dispatch({ effects: themeCompartment.reconfigure(themeExt) });
    },

    /**
     * Bật/tắt chỉ đọc.
     * @param {boolean} value
     */
    setReadOnly(value) {
      view.dispatch({
        effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(value)),
      });
    },

    focus() { view.focus(); },

    destroy() { view.destroy(); },
  };
}

/**
 * Nội bộ: resolve language extension từ tên ngôn ngữ.
 * @param {string|undefined} name
 * @param {object} [langOptions]
 */
function _resolveLanguage(name, langOptions = {}) {
  if (!name) return [];
  const registry = window.__CMLanguages || {};
  const factory = registry[name.toLowerCase()];
  if (!factory) {
    console.warn(
      `[CodeMirrorEditor] Language "${name}" not found. ` +
      `Load the corresponding language pack script before calling create().`
    );
    return [];
  }
  return factory(langOptions);
}

// ─── Expose global API ────────────────────────────────────────────────────────
window.CodeMirrorEditor = { create };

export { create };
