import { EditorState, SelectionState, RichUtils, Modifier } from 'draft-js';
import keyCommandInsertNewline from 'draft-js/lib/keyCommandInsertNewline';
import {
  BLOCK_TYPES,
  EDITOR_CHANGE_TYPE,
  MODIFIER_RANGE_DIRECTION,
} from '../constants/DraftEditorConstant';

/**
 *
 */
export function getCurrentBlock(editorState) {
  const currentSelection = editorState.getSelection();
  const currentKey = currentSelection.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  return currentContent.getBlockForKey(currentKey);
}

export function createEntity(editorState, type, mutability, data) {
  console.warn('createEntity is deprecated, use insertEntity instead');
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    type,
    mutability,
    data,
  );
  return contentStateWithEntity.getLastCreatedEntityKey();
}

export function insertEntity(editorState, type, mutability, data) {
  const contentState = editorState.getCurrentContent();
  const contentWithEntity = contentState.createEntity(type, mutability, data);

  const entityKey = contentWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentWithEntity,
  });

  return RichUtils.toggleLink(
    newEditorState,
    newEditorState.getSelection(),
    entityKey,
  );
}

/**
 *
 */
export function insertCodeBlock(editorState) {
  let newEditorState = resetBlockType(editorState, BLOCK_TYPES.CODE);

  // TODO Check if there is already an empty block after the code block
  // and don't create new empty block if it already exists
  const savedSelectionState = newEditorState.getSelection();
  newEditorState = keyCommandInsertNewline(newEditorState);
  newEditorState = RichUtils.toggleBlockType(
    newEditorState,
    BLOCK_TYPES.DEFAULT,
  );

  return EditorState.forceSelection(newEditorState, savedSelectionState);
}

/**
 *
 */
export function insertSoftNewline(editorState) {
  const selection = editorState.getSelection();

  if (selection.isCollapsed()) {
    return RichUtils.insertSoftNewline(editorState);
  }

  const content = editorState.getCurrentContent();
  let newContent = Modifier.removeRange(
    content,
    selection,
    MODIFIER_RANGE_DIRECTION.FORWARD,
  );
  const newSelection = newContent.getSelectionAfter();
  const block = newContent.getBlockForKey(newSelection.getStartKey());
  newContent = Modifier.insertText(
    newContent,
    newSelection,
    '\n',
    block.getInlineStyleAt(newSelection.getStartOffset()),
    null,
  );

  return EditorState.push(
    editorState,
    newContent,
    EDITOR_CHANGE_TYPE.INSERT_FRAGMENT,
  );
}

export function resetBlockType(
  editorState,
  blockType,
  removeCurrentText = true,
) {
  let newEditorState = editorState;

  if (removeCurrentText) {
    const contentState = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const currentBlock = getCurrentBlock(editorState);
    const removeRange = SelectionState.createEmpty().merge({
      anchorKey: currentSelection.getAnchorKey(),
      anchorOffset: 0,
      focusKey: currentSelection.getFocusKey(),
      focusOffset: currentBlock.getText().length,
    });
    const newContentState = Modifier.removeRange(
      contentState,
      removeRange,
      'backward',
    );

    newEditorState = EditorState.forceSelection(
      EditorState.push(editorState, newContentState, 'remove-range'),
      SelectionState.createEmpty().merge({
        anchorKey: currentSelection.getAnchorKey(),
        anchorOffset: 0,
        focusKey: currentSelection.getAnchorKey(),
        focusOffset: 0,
      }),
    );
  }

  return RichUtils.toggleBlockType(newEditorState, blockType);
}

/**
 * Return true if the block has faux text in their empty state, or a wrapper
 * that is visible clearly to the user
 */
export function isBlockWithFauxText(block) {
  return (
    block.getType() === BLOCK_TYPES.OL ||
    block.getType() === BLOCK_TYPES.UL ||
    block.getType() === BLOCK_TYPES.CODE
  );
}

export function isOnEmptyBlock(editorState) {
  const block = getCurrentBlock(editorState);
  return block.getText() === '';
}

export function removeCurrentBlock(editorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const contentBlock = contentState.getBlockForKey(
    selectionState.getAnchorKey(),
  );
  const previousBlock = contentState.getBlockBefore(
    selectionState.getAnchorKey(),
  );
  const nextBlock = contentState.getBlockAfter(selectionState.getFocusKey());

  let removeRange, removeDirection, nextSelection;
  if (previousBlock) {
    removeDirection = 'backward';
    removeRange = SelectionState.createEmpty().merge({
      anchorKey: previousBlock.getKey(),
      anchorOffset: previousBlock.getText().length,
      focusKey: selectionState.getAnchorKey(),
      focusOffset: contentBlock.getText().length,
    });
    nextSelection = SelectionState.createEmpty().merge({
      anchorKey: previousBlock.getKey(),
      anchorOffset: previousBlock.getText().length,
      focusKey: previousBlock.getKey(),
      focusOffset: previousBlock.getText().length,
    });
  } else if (nextBlock) {
    removeDirection = 'forward';
    removeRange = SelectionState.createEmpty().merge({
      anchorKey: selectionState.getAnchorKey(),
      anchorOffset: 0,
      focusKey: nextBlock.getKey(),
      focusOffset: 0,
    });
    nextSelection = SelectionState.createEmpty().merge({
      anchorKey: nextBlock.getKey(),
      anchorOffset: 0,
      focusKey: nextBlock.getKey(),
      focusOffset: 0,
    });
  } else {
    // No previous and next block which means it's the only block
    // Only remove the text inside and left the block as it is
    removeDirection = 'backward';
    removeRange = SelectionState.createEmpty().merge({
      anchorKey: selectionState.getAnchorKey(),
      anchorOffset: 0,
      focusKey: selectionState.getAnchorKey(),
      focusOffset: contentBlock.getText().length,
    });
    nextSelection = SelectionState.createEmpty().merge({
      anchorKey: selectionState.getAnchorKey(),
      anchorOffset: 0,
      focusKey: selectionState.getAnchorKey(),
      focusOffset: 0,
    });
  }

  const newContentState = Modifier.removeRange(
    contentState,
    removeRange,
    removeDirection,
  );

  return EditorState.forceSelection(
    EditorState.push(editorState, newContentState, 'remove-range'),
    nextSelection,
  );
}

export function applyEntityInSelection(editorState, entityKey) {
  console.warn(
    'applyEntityInSelection is deprecated, use insertEntity instead',
  );
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const newContentState = Modifier.applyEntity(
    contentState,
    selectionState,
    entityKey,
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'apply-entity',
  );

  return RichUtils.toggleLink(
    newEditorState,
    newEditorState.getSelection(),
    entityKey,
  );
}

export function removeEntityFromSelection(editorState) {
  return applyEntityInSelection(editorState, null);
}

export function isEntityInSelection(editorState) {
  const block = getCurrentBlock(editorState);
  const selectionState = editorState.getSelection();
  const entityKey = block.getEntityAt(selectionState.getStartOffset());
  return Boolean(entityKey);
}

export function pasteCodeBlock(editorState, text) {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const newContentState = Modifier.replaceText(contentState, selection, text);

  return EditorState.push(editorState, newContentState, 'insert-characters');
}
