/* eslint react/jsx-handler-names: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Draft, { Editor, RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import KeyBindingUtil from 'draft-js/lib/KeyBindingUtil';
import Style from './PaperContentEditor.css';

import AtomicRenderer from '../shared/renderer/AtomicRenderer';
import EmbedInputRenderer from '../shared/renderer/EmbedInputRenderer';

import { BLOCK_TYPES } from '../../constants/DraftEditorConstant';
import { STYLE_MAP, KeyCommands } from '../../constants/PaperEditorConstant';
import {
  predictActionFromNewline,
  predictActionFromSpace,
} from '../../helpers/PaperPredictionHelper';

import {
  getCurrentBlock,
  isBlockWithFauxText,
  isOnEmptyBlock,
  resetBlockType,
  pasteCodeBlock,
} from '../../helpers/DraftEditorHelper';

import {
  resetEditorMediaState,
  showEditorMedia,
} from '../../actions/EditorMediaAction';

import { showEmbedInput } from '../../actions/EditorEmbedAction';

import { showLinkInput } from '../../actions/EditorToolbarAction';

const blockRenderMap = DefaultDraftBlockRenderMap.merge({
  [BLOCK_TYPES.EMBED_INPUT]: {
    element: 'div',
  },
  [BLOCK_TYPES.EMBED_VIDEO_INPUT]: {
    element: 'div',
  },
});

function getBlockStyle(block) {
  switch (block.getType()) {
    case BLOCK_TYPES.P:
      return Style.paragraph;
    case BLOCK_TYPES.CODE:
      return Style.code;
    case BLOCK_TYPES.H1:
      return Style.h1;
    case BLOCK_TYPES.H2:
      return Style.h2;
    case BLOCK_TYPES.ATOMIC:
      return Style.atomic;
    case BLOCK_TYPES.EMBED_INPUT:
    case BLOCK_TYPES.EMBED_VIDEO_INPUT:
      return Style.paragraph;
    default:
      return Style.paragraph;
  }
}

function keyBindingFn(e) {
  switch (e.keyCode) {
    case 69: // E
      return KeyBindingUtil.hasCommandModifier(e)
        ? KeyCommands.INSERT_EMBED
        : null;
    case 75: // K
      return KeyBindingUtil.hasCommandModifier(e)
        ? KeyCommands.INSERT_LINK
        : null;
    default:
      return Draft.getDefaultKeyBinding(e);
  }
}

function blockRenderer(contentBlock) {
  const type = contentBlock.getType();

  switch (type) {
    case BLOCK_TYPES.ATOMIC:
      return {
        component: AtomicRenderer,
        editable: true,
      };
    case BLOCK_TYPES.EMBED_INPUT:
      return {
        component: EmbedInputRenderer,
        editable: true,
        props: {
          placeholder:
            'Paste a link to embed content from another site (e.g. Twitter) and press Enter',
        },
      };
    case BLOCK_TYPES.EMBED_VIDEO_INPUT:
      return {
        component: EmbedInputRenderer,
        editable: true,
        props: {
          placeholder: 'Paste a YouTube link, and press Enter',
        },
      };
    default:
    // no default
  }
}

function getBodyPlaceholder(editorState) {
  let showBodyPlaceholder = false;
  const firstBlock = editorState.getCurrentContent().getFirstBlock();

  if (firstBlock.getLength() === 0) {
    switch (firstBlock.getType()) {
      case BLOCK_TYPES.OL:
      case BLOCK_TYPES.UL:
        showBodyPlaceholder = false;
        break;
      default:
        showBodyPlaceholder = true;
    }
  }

  return showBodyPlaceholder ? 'Write your post...' : null;
}

export default class PaperContentEditor extends React.Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelection: PropTypes.func,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    this.rect = this.domRef.getBoundingClientRect();
    this.editor.focus();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.editorState !== nextProps.editorState;
  }

  componentDidUpdate() {
    const { editorState } = this.props;
    const selectionState = editorState.getSelection();

    if (selectionState.getHasFocus() && isOnEmptyBlock(editorState)) {
      this.props.dispatch(showEditorMedia(editorState));
    } else if (!isOnEmptyBlock(editorState)) {
      this.props.dispatch(resetEditorMediaState());
    }
  }

  handleReturn = e => {
    const newEditorState = predictActionFromNewline(this.props.editorState, e);

    if (newEditorState !== null) {
      Promise.resolve(newEditorState).then(this.props.onChange);
      return true;
    }

    return false;
  };

  handleKeyCommand = command => {
    switch (command) {
      case KeyCommands.INSERT_LINK: {
        this.props.dispatch(showLinkInput());
        return true;
      }
      case KeyCommands.INSERT_EMBED: {
        this.props.dispatch(showEmbedInput());
        return true;
      }
      default:
      // no default
    }

    const currentBlock = getCurrentBlock(this.props.editorState);
    const previousBlock = this.props.editorState
      .getCurrentContent()
      .getBlockBefore(currentBlock.getKey());

    // Somehow when pressing backspace after atomic block inside an empty block,
    // it will remove the atomic block. While this is generally a correct behavior
    // for "simple" block types such as heading and default text, applying the
    // behavior in some blocks where it has faux text or wrapper is undesired
    // because user expects the number / wrapper to be removed instead of previous
    // block
    if (
      previousBlock &&
      command === 'backspace' &&
      previousBlock.getType() === BLOCK_TYPES.ATOMIC &&
      isBlockWithFauxText(currentBlock) &&
      isOnEmptyBlock(this.props.editorState)
    ) {
      const newEditorState = resetBlockType(
        this.props.editorState,
        BLOCK_TYPES.DEFAULT,
      );
      this.props.onChange(newEditorState);
      return true;
    }

    if (command === 'code') {
      const newEditorState = RichUtils.toggleInlineStyle(
        this.props.editorState,
        'INLINE_CODE',
      );
      this.props.onChange(newEditorState);
      return true;
    }

    const newEditorState = RichUtils.handleKeyCommand(
      this.props.editorState,
      command,
    );

    if (newEditorState) {
      this.props.onChange(newEditorState);
      return true;
    }

    return false;
  };

  handlePastedText = (text, html, editorState) => {
    const currentBlock = getCurrentBlock(editorState);

    if (currentBlock.getType() === BLOCK_TYPES.CODE) {
      this.props.onChange(pasteCodeBlock(editorState, text));
      return true;
    }
  };

  handleBeforeInput = string => {
    if (string === ' ') {
      const newEditorState = predictActionFromSpace(this.props.editorState);
      if (newEditorState) {
        this.props.onChange(newEditorState);
        return true;
      }
    }

    return false;
  };

  handleChange = editorState => {
    // Editor change also triggered when selection changes occur
    // we want to display editor tools when selection happen, so we
    // need to compare cursor position between selection to detect
    // when selection happen
    const selection = editorState.getSelection();
    if (!selection.isCollapsed() && selection.getHasFocus()) {
      return this.props.onSelection(editorState);
    }

    this.props.onChange(editorState);
  };

  storeEditorRef = ref => {
    this.editor = ref;
  };

  storeDOMRef = ref => {
    this.domRef = ref;
  };

  render() {
    const bodyPlaceholder = getBodyPlaceholder(this.props.editorState);

    return (
      <div className={Style.bodyInput} ref={this.storeDOMRef}>
        <Editor
          ref={this.storeEditorRef}
          keyBindingFn={keyBindingFn}
          customStyleMap={STYLE_MAP}
          placeholder={bodyPlaceholder}
          blockStyleFn={getBlockStyle}
          blockRendererFn={blockRenderer}
          blockRenderMap={blockRenderMap}
          handleReturn={this.handleReturn}
          handleKeyCommand={this.handleKeyCommand}
          handlePastedText={this.handlePastedText}
          handleBeforeInput={this.handleBeforeInput}
          onChange={this.handleChange}
          editorState={this.props.editorState}
        />
      </div>
    );
  }
}
