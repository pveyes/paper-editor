export const BLOCK_TYPES = {
  CODE: 'code-block',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  /**
   * We use h1 and h2 as the button icon, but the block type
   * will be h2 and h3 respectively because h1 is reserved
   * for post title
   */
  H1: 'header-two',
  H2: 'header-three',
  P: 'unstyled',
  ATOMIC: 'atomic',
  EMBED_INPUT: 'embed-input',
  EMBED_VIDEO_INPUT: 'embed-video-input',
  DEFAULT: 'unstyled',
};

export const EDITOR_CHANGE_TYPE = {
  INSERT_FRAGMENT: 'insert-fragment',
};

export const MODIFIER_RANGE_DIRECTION = {
  FORWARD: 'forward',
};
