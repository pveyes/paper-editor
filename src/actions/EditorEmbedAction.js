import { EditorState, RichUtils } from 'draft-js';

import { updateEditorState } from './EditorAction';

import { insertNewPartToEditorState } from '../helpers/PaperAtomicBlockHelper';

import { BLOCK_TYPES } from '../constants/DraftEditorConstant';

export const SELECT_EMBED_WITH_ENTITY = 'editor.embed.select_with_entity';
export const CLEAR_SELECT_EMBED_WITH_ENTITY =
  'editor.embed.clear_select_entity';
export const SHOW_EMBED_INPUT = 'editor.embed.show_input';

export function selectEmbedWithEntity(entity, block) {
  return {
    type: SELECT_EMBED_WITH_ENTITY,
    entity,
    block,
  };
}

export function clearSelectEmbedWithEntity() {
  return { type: CLEAR_SELECT_EMBED_WITH_ENTITY };
}

export function showEmbedInput(embedType) {
  return (dispatch, getState) => {
    const { titleEditorState, contentEditorState } = getState().draft;

    let blockType = BLOCK_TYPES.EMBED_INPUT;
    if (embedType === 'video') {
      blockType = BLOCK_TYPES.EMBED_VIDEO_INPUT;
    }

    const selectionState = contentEditorState.getSelection();
    const newContentEditorState = EditorState.forceSelection(
      RichUtils.toggleBlockType(contentEditorState, blockType),
      selectionState,
    );

    return dispatch(updateEditorState(titleEditorState, newContentEditorState));
  };
}

export function showVideoEmbedInput() {
  return showEmbedInput('video');
}

export function insertNewPart() {
  return (dispatch, getState) => {
    const { draft } = getState();
    const newContentEditorState = insertNewPartToEditorState(
      draft.contentEditorState,
    );
    dispatch(updateEditorState(draft.titleEditorState, newContentEditorState));
  };
}
