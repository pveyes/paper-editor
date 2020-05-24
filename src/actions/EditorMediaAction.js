export const SHOW_EDITOR_MEDIA = 'editor.media.show';
export const RESET_EDITOR_MEDIA_STATE = 'editor.media.reset_state';
export const TOGGLE_EDITOR_MEDIA_SELECTION = 'editor.media.toggle_selection';

/**
 * Action creator to show where to place editor media button. The position
 * is calculated based on where the current empty block in the DOM
 */
export function showEditorMedia(editorState) {
  const currentBlockKey = editorState.getSelection().getAnchorKey();
  const rect = document
    .querySelector(`[data-offset-key^="${currentBlockKey}"]`)
    .getBoundingClientRect();

  return {
    type: SHOW_EDITOR_MEDIA,
    // content margin top (100px)
    // pixel perfect adjustment (1px)
    top: rect.top - 100 - 1 + window.scrollY,
    // button width (32px) + margin (20px)
    left: -52,
  };
}

export function resetEditorMediaState() {
  return { type: RESET_EDITOR_MEDIA_STATE };
}

export function toggleEditorMediaSelection() {
  return { type: TOGGLE_EDITOR_MEDIA_SELECTION };
}
