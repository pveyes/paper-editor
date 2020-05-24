export const SHOW_TOOLBAR = 'editor.toolbar.show';
export const HIDE_TOOLBAR = 'editor.toolbar.hide';
export const CLOSE_LINK_INPUT = 'editor.toolbar.close_link_input';
export const SHOW_LINK_INPUT = 'editor.toolbar.show_link_input';

export function showToolbar(top, left) {
  return { type: SHOW_TOOLBAR, top, left };
}

export function hideToolbar() {
  return { type: HIDE_TOOLBAR };
}

export function closeLinkInput() {
  return { type: CLOSE_LINK_INPUT };
}

export function showLinkInput() {
  return { type: SHOW_LINK_INPUT };
}
