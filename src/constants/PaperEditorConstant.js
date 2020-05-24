export const KeyCommands = {
  INSERT_EMBED: 'paper.cmd.insert-embed',
  INSERT_LINK: 'paper.cmd.insert-link',
};

export const SAVE_STATUS = {
  DRAFT: 'draft',
  SAVING: 'saving',
  SAVED: 'saved',
  FAILED: 'failed',
};

export const ENTITY_TYPES = {
  LINK: 'LINK',
  DIVIDER: 'DIVIDER',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  VIDEO_EMBED: 'VIDEO_EMBED',
  HTML_EMBED: 'HTML_EMBED',
  EMBED: 'EMBED',
  GITHUB_GIST: 'GITHUB_GIST',
};

export const EDITOR_MODE = {
  WRITE: 'mode-write',
  EDIT: 'mode-edit',
  EDIT_PUBLISHED: 'mode-edit-published',
};

export const VISIBILITY_OPTION = {
  VISIBLE: 'visible',
  UNLISTED: 'unlisted',
};

export const PUBLISH_OPTION_MODE = {
  PUBLISH: 'mode-publish',
  VISIBILITY_OPTION: 'mode-visibility-option',
  CUSTOM_META: 'mode-custom-meta',
};

export const STYLE_MAP = {
  INLINE_CODE: {
    backgroundColor: '#fcfcfc',
    border: '1px solid rgba(0, 0, 0, .08)',
    borderRadius: '3px',
    padding: '5px',
    lineHeight: 1,
    verticalAlign: 'middle',
    fontSize: '.7em',
    display: 'inline-block',
    color: 'rgba(210, 0, 0, .8)',
    fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },
};

export const DEFAULT_EDITOR_MODE = EDITOR_MODE.WRITE;
export const DEFAULT_PAGE_TITLE = 'Untitled Post';
export const DEFAULT_SAVE_STATUS = SAVE_STATUS.DRAFT;
export const DEFAULT_PUBLISH_OPTION_MODE = PUBLISH_OPTION_MODE.PUBLISH;
