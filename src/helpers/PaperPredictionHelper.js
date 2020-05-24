import { RichUtils } from 'draft-js';
import keyCommandInsertNewline from 'draft-js/lib/keyCommandInsertNewline';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { BLOCK_TYPES } from '../constants/DraftEditorConstant';
import {
  getCurrentBlock,
  resetBlockType,
  insertCodeBlock,
  insertSoftNewline,
} from './DraftEditorHelper';
import { insertEmbedFromInlineUrl } from './PaperAtomicBlockHelper';

/**
 * @return Promise|value
 */
export function predictActionFromNewline(editorState, event) {
  const possibleActions = [
    () => embedInlineUrl(editorState),
    () => softNewline(editorState, event),
    () => newlineInsideHeading(editorState),
    () => newlineInsideList(editorState),
    () => newlineInsideCodeBlock(editorState),
    () => newlineAfterTripleBackticks(editorState),
  ];

  for (const action of possibleActions) {
    const result = action();
    if (result) {
      return result;
    }
  }

  return null;
}

export function predictActionFromSpace(editorState) {
  const text = getCurrentBlock(editorState).getText();

  switch (text) {
    case '1.':
      return resetBlockType(editorState, BLOCK_TYPES.OL);
    case '*':
    case '-':
      return resetBlockType(editorState, BLOCK_TYPES.UL);
    case '#':
      return resetBlockType(editorState, BLOCK_TYPES.H1);
    case '##':
      return resetBlockType(editorState, BLOCK_TYPES.H2);
    default:
      return null;
  }
}

function embedInlineUrl(editorState) {
  const text = getCurrentBlock(editorState).getText();

  if (text.match(/^https?/)) {
    // possible embed via inline url
    const result = insertEmbedFromInlineUrl(editorState, text);
    return result.valid ? result.editorState : null;
  }

  return null;
}

function softNewline(editorState, event) {
  if (isSoftNewlineEvent(event)) {
    return insertSoftNewline(editorState);
  }
}

function newlineInsideHeading(editorState) {
  const currentBlockType = getCurrentBlock(editorState).getType();

  if (
    currentBlockType === BLOCK_TYPES.H1 ||
    currentBlockType === BLOCK_TYPES.H2
  ) {
    const newEditorState = keyCommandInsertNewline(editorState);
    return RichUtils.toggleBlockType(newEditorState, BLOCK_TYPES.DEFAULT);
  }
}

function newlineInsideCodeBlock(editorState) {
  const currentBlockType = getCurrentBlock(editorState).getType();

  if (currentBlockType === BLOCK_TYPES.CODE) {
    return insertSoftNewline(editorState);
  }
}

function newlineInsideList(editorState) {
  const currentBlock = getCurrentBlock(editorState);
  const currentBlockType = currentBlock.getType();
  const listBlockTypes = [BLOCK_TYPES.OL, BLOCK_TYPES.UL];

  if (
    listBlockTypes.indexOf(currentBlockType) > -1 &&
    currentBlock.getLength() === 0
  ) {
    return resetBlockType(editorState, BLOCK_TYPES.DEFAULT, false);
  }
}

function newlineAfterTripleBackticks(editorState) {
  const currentBlock = getCurrentBlock(editorState);

  if (currentBlock.getText() === '```') {
    return insertCodeBlock(editorState);
  }
}
