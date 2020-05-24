import { convertToRaw } from 'draft-js';
import Post from '../api/PostService';

import {
  EDITOR_MODE,
  DEFAULT_PAGE_TITLE,
  SAVE_STATUS,
  VISIBILITY_OPTION,
  PUBLISH_OPTION_MODE,
} from '../constants/PaperEditorConstant';

import {
  exportAsPlainText,
  exportAsHtml,
  rawToHtml,
} from '../helpers/PaperEditorHelper';

import { clearSelectEmbedWithEntity } from './EditorEmbedAction';

/**
 * Action types
 */
export const CHANGE_EDITOR_MODE = 'editor.change_mode';
export const CHANGE_PUBLISH_OPTION_MODE = 'editor.change_publish_option_mode';
export const CHANGE_VISIBILITY_OPTION = 'editor.change_visibility_option';
export const HIDE_PUBLISH_OPTION_POPOVER = 'editor.hide_publisth_option';
export const POST_LOADED = 'editor.post_loaded';
export const RESET_EDITOR_STATE = 'editor.reset_state';
export const RESET_POST_META = 'editor.reset_post_meta';
export const RESET_VISIBILITY_OPTION = 'editor.reset_visibility_option';
export const TOGGLE_PUBLISH_OPTION_POPOVER = 'editor.toggle_publish_option';
export const UPDATE_DRAFT = 'editor.update_draft';
export const UPDATE_LAST_AUTOSAVE = 'editor.update_last_autosave';
export const UPDATE_POST = 'editor.update_post';
export const UPDATE_SAVE_STATUS = 'editor.update_status';

export function clearPublishOption(options = {}) {
  return dispatch => {
    if (options.resetData) {
      dispatch(resetVisibilityOption());
      dispatch(resetDraftMeta());
    }

    dispatch(changePublishOptionMode(PUBLISH_OPTION_MODE.PUBLISH));
    if (options.closePopover) {
      dispatch({ type: HIDE_PUBLISH_OPTION_POPOVER });
    }
  };
}

export function togglePublishOptionPopover() {
  return {
    type: TOGGLE_PUBLISH_OPTION_POPOVER,
  };
}

export function changePublishOptionMode(mode) {
  return {
    type: CHANGE_PUBLISH_OPTION_MODE,
    mode,
  };
}

export function toggleCustomMeta(enabled) {
  return (dispatch, getState) => {
    const { post, draft } = getState();
    dispatch({
      type: UPDATE_DRAFT,
      draft: {
        customMeta: enabled,
        meta: enabled ? draft.meta : post.meta,
      },
    });
  };
}

export function changeDraftMeta(title, description) {
  return {
    type: UPDATE_DRAFT,
    draft: {
      meta: {
        title,
        description,
      },
    },
  };
}

export function changeVisibilityOption(visibilityOption) {
  return {
    type: UPDATE_DRAFT,
    draft: {
      visible: visibilityOption === VISIBILITY_OPTION.VISIBLE,
    },
  };
}

export function resetDraftMeta() {
  return (dispatch, getState) => {
    const { post } = getState();
    dispatch({
      type: UPDATE_DRAFT,
      draft: {
        meta: post.meta,
        customMeta: post.customMeta,
      },
    });
  };
}

export function resetVisibilityOption() {
  return (dispatch, getState) => {
    const { post } = getState();
    dispatch({
      type: UPDATE_DRAFT,
      draft: {
        visible: post.visible,
      },
    });
  };
}

export function updateDraftTags(tags) {
  return {
    type: UPDATE_DRAFT,
    draft: {
      tags,
    },
  };
}

export function updateContentEditorState(contentEditorState) {
  return (dispatch, getState) => {
    const { draft: { titleEditorState } } = getState();
    dispatch(updateEditorState(titleEditorState, contentEditorState));
  };
}

export function updateEditorState(titleEditorState, contentEditorState) {
  return async (dispatch, getState) => {
    dispatch({
      type: UPDATE_DRAFT,
      draft: {
        titleEditorState,
        contentEditorState,
      },
    });

    const selectionstate = contentEditorState.getSelection();
    const { embed: { activeBlock } } = getState();
    if (activeBlock && selectionstate.getAnchorKey() !== activeBlock.getKey()) {
      dispatch(clearSelectEmbedWithEntity());
    }

    const title = titleEditorState
      .getCurrentContent()
      .getFirstBlock()
      .getText();
    const firstContent = contentEditorState
      .getCurrentContent()
      .getFirstBlock()
      .getText();

    if (title) {
      updatePageTitle(title);
    } else {
      updatePageTitle(firstContent);
    }
  };
}

export function saveEditorState(forceSave) {
  return async (dispatch, getState) => {
    const {
      post: { id: postId },
      draft,
      editorMode,
      lastAutoSave,
    } = getState();

    const title = exportAsPlainText(draft.titleEditorState);
    const content = exportAsHtml(draft.contentEditorState);
    const raw = convertToRaw(draft.contentEditorState.getCurrentContent());

    if (!forceSave) {
      if (title === '' && exportAsPlainText(draft.contentEditorState) === '') {
        return;
      }

      if (title === lastAutoSave.title && content === lastAutoSave.content) {
        return;
      }
    }

    dispatch({ type: UPDATE_SAVE_STATUS, status: SAVE_STATUS.SAVING });

    try {
      const newPost = {
        title,
        // Content is sent using _ prefix to mark that this should
        // not trigger update, but rather generate stats from content
        // TODO compute stats client side so we don't need to send content
        _content: content,
        // Instead of autosaving content, we autosave the raw object.
        // This allow us to autosave edit on published post, without
        // actually republish it implicitly
        raw,
        visible: draft.visible,
        meta: draft.meta,
        customMeta: draft.customMeta,
      };

      if (editorMode === EDITOR_MODE.WRITE) {
        const result = await Post.create(newPost);

        if (result.post) {
          dispatch({ type: CHANGE_EDITOR_MODE, mode: EDITOR_MODE.EDIT });
          dispatch({
            type: UPDATE_POST,
            post: { id: result.post.id, ...newPost },
          });
          dispatch({ type: UPDATE_SAVE_STATUS, status: SAVE_STATUS.SAVED });
          dispatch(updateLastAutoSave(title, content));
          return result.post;
        }
      }

      await Post.update(postId, newPost);
      dispatch(updateLastAutoSave(title, content));
      dispatch({ type: UPDATE_SAVE_STATUS, status: SAVE_STATUS.SAVED });
    } catch (err) {
      dispatch({ type: UPDATE_SAVE_STATUS, status: SAVE_STATUS.FAILED });
    }
  };
}

export function updateLastAutoSave(title, content) {
  return {
    type: UPDATE_LAST_AUTOSAVE,
    title,
    content,
  };
}

export function initWriteMode() {
  updatePageTitle();

  return dispatch => {
    dispatch({
      type: RESET_EDITOR_STATE,
    });

    dispatch({
      type: CHANGE_EDITOR_MODE,
      mode: EDITOR_MODE.WRITE,
    });
  };
}

export function loadPost(id) {
  return async (dispatch, getState) => {
    dispatch({ type: RESET_EDITOR_STATE });

    const { post } = await Post.getById(id);
    if (post) {
      updatePageTitle(post.title);
      dispatch({ type: POST_LOADED, post });
      dispatch(updateLastAutoSave(post.title, rawToHtml(post.raw)));

      if (post.publishedAt) {
        dispatch({
          type: CHANGE_EDITOR_MODE,
          mode: EDITOR_MODE.EDIT_PUBLISHED,
        });
      } else {
        dispatch({ type: CHANGE_EDITOR_MODE, mode: EDITOR_MODE.EDIT });
      }
    }
  };
}

export function publishPost() {
  return async (dispatch, getState, { router }) => {
    const {
      post: { id: postId },
      draft: {
        titleEditorState,
        contentEditorState,
        visible,
        meta,
        customMeta,
        tags: draftTags,
      },
      editorMode,
    } = getState();

    const title = exportAsPlainText(titleEditorState);
    const content = exportAsHtml(contentEditorState);

    if (title && content) {
      try {
        const raw = convertToRaw(contentEditorState.getCurrentContent());
        const tags = draftTags
          .trim()
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);
        const post = { title, content, raw, tags, visible, customMeta, meta };
        const updateDate = editorMode === EDITOR_MODE.EDIT_PUBLISHED;
        return await Post.publish(postId, post, updateDate);
      } catch (err) {
        throw new Error('Publishing post failed', err);
      }
    }

    throw new Error('Title/content must not be empty');
  };
}

function updatePageTitle(title = DEFAULT_PAGE_TITLE) {
  document.title = `Paper - Editing ${title}`;
}
