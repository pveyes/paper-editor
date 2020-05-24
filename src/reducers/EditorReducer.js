import { EditorState } from 'draft-js';
import { combineReducers } from 'redux';
import editorToolbar from './EditorToolbarReducer';
import embed from './EditorEmbedReducer';

import {
  DEFAULT_EDITOR_MODE,
  DEFAULT_PUBLISH_OPTION_MODE,
  DEFAULT_SAVE_STATUS,
} from '../constants/PaperEditorConstant';

import {
  CHANGE_EDITOR_MODE,
  CHANGE_PUBLISH_OPTION_MODE,
  HIDE_PUBLISH_OPTION_POPOVER,
  POST_LOADED,
  RESET_EDITOR_STATE,
  TOGGLE_PUBLISH_OPTION_POPOVER,
  UPDATE_DRAFT,
  UPDATE_LAST_AUTOSAVE,
  UPDATE_POST,
  UPDATE_SAVE_STATUS,
} from '../actions/EditorAction';

import {
  RESET_EDITOR_MEDIA_STATE,
  SHOW_EDITOR_MEDIA,
  TOGGLE_EDITOR_MEDIA_SELECTION,
} from '../actions/EditorMediaAction';

import { decorator, parsePostData } from '../helpers/PaperEditorHelper';

const DRAFT = {
  titleEditorState: EditorState.createEmpty(),
  contentEditorState: EditorState.createEmpty(decorator),
  meta: {
    title: '',
    description: '',
  },
  customMeta: false,
  tags: '',
  visible: true,
};

const POST = {
  meta: DRAFT.meta,
};

const EDITOR_MEDIA = {
  show: false,
  style: {},
  showSelection: false,
};

export function post(state = POST, action) {
  switch (action.type) {
    case POST_LOADED:
      return action.post;
    case UPDATE_POST:
      return Object.assign({}, state, action.post);
    default:
      return state;
  }
}

export function draft(state = DRAFT, action) {
  switch (action.type) {
    case RESET_EDITOR_STATE:
      return DRAFT;
    case UPDATE_POST:
      return Object.assign({}, state, { id: action.post.id });
    case POST_LOADED:
      return Object.assign({}, state, parsePostData(action.post));
    case UPDATE_DRAFT:
      return Object.assign({}, state, action.draft);
    default:
      return state;
  }
}

export function lastAutoSave(state = { title: '', content: '' }, action) {
  switch (action.type) {
    case UPDATE_LAST_AUTOSAVE:
      return {
        title: action.title,
        content: action.content,
      };
    default:
      return state;
  }
}

export function editorMedia(state = EDITOR_MEDIA, action) {
  switch (action.type) {
    case SHOW_EDITOR_MEDIA:
      return Object.assign({}, state, {
        show: true,
        style: { top: action.top, left: action.left },
        showSelection: false,
      });
    case RESET_EDITOR_MEDIA_STATE:
      return EDITOR_MEDIA;
    case TOGGLE_EDITOR_MEDIA_SELECTION:
      return Object.assign({}, state, { showSelection: !state.showSelection });
    default:
      return state;
  }
}

export function editorMode(state = DEFAULT_EDITOR_MODE, action) {
  switch (action.type) {
    case CHANGE_EDITOR_MODE:
      return action.mode;
    default:
      return state;
  }
}

export function saveStatus(state = DEFAULT_SAVE_STATUS, action) {
  switch (action.type) {
    case RESET_EDITOR_STATE:
      return DEFAULT_SAVE_STATUS;
    case UPDATE_SAVE_STATUS:
      return action.status;
    default:
      return state;
  }
}

export function publishOptionActive(state = false, action) {
  switch (action.type) {
    case TOGGLE_PUBLISH_OPTION_POPOVER:
      return !state;
    case HIDE_PUBLISH_OPTION_POPOVER:
      return false;
    default:
      return state;
  }
}

export function publishOptionMode(state = DEFAULT_PUBLISH_OPTION_MODE, action) {
  switch (action.type) {
    case CHANGE_PUBLISH_OPTION_MODE:
      return action.mode;
    default:
      return state;
  }
}

export default combineReducers({
  post,
  draft,
  lastAutoSave,
  editorMode,
  saveStatus,
  embed,
  editorMedia,
  editorToolbar,
  publishOption: combineReducers({
    active: publishOptionActive,
    mode: publishOptionMode,
  }),
});
