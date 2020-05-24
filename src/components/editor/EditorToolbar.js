import React from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';
import { connect } from 'react-redux';
import EditorStyleButton, { EditorButtonLabel } from './EditorStyleButton';
import EditorToolbarSpacer from './EditorToolbarSpacer';
import EditorLinkInput from './EditorLinkInput';

import {
  removeEntityFromSelection,
  isEntityInSelection,
  insertEntity,
} from '../../helpers/DraftEditorHelper';

import {
  hideToolbar,
  closeLinkInput,
  showLinkInput,
} from '../../actions/EditorToolbarAction';

import { updateContentEditorState } from '../../actions/EditorAction';

import { BLOCK_TYPES } from '../../constants/DraftEditorConstant';
import Style from './EditorToolbar.css';

const INLINE_STYLES = [
  { label: EditorButtonLabel.BOLD, style: 'BOLD' },
  { label: EditorButtonLabel.ITALIC, style: 'ITALIC' },
];

const BLOCK_STYLES = [
  { label: EditorButtonLabel.H1, style: BLOCK_TYPES.H1 },
  { label: EditorButtonLabel.H2, style: BLOCK_TYPES.H2 },
  { label: EditorButtonLabel.BLOCKQUOTE, style: BLOCK_TYPES.QUOTE },
  { label: EditorButtonLabel.CODE, style: BLOCK_TYPES.CODE },
];

class EditorToolbar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    toolbarPosition: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
    }),
    showLinkInput: PropTypes.bool,
    linkInputValue: PropTypes.string,
  };

  width = 0;
  height = 0;

  componentDidMount() {
    this.domRef.className = Style.editorToolbarActive;
    const toolbarRect = this.domRef.getBoundingClientRect();
    this.domRef.className = Style.editorToolbar;

    this.width = toolbarRect.width - 2 * 11;
    this.height = toolbarRect.height - 2 * 7;
  }

  handleToggleBlockType = blockType => {
    const newEditorState = RichUtils.toggleBlockType(
      this.props.editorState,
      blockType,
    );

    this.props.dispatch(updateContentEditorState(newEditorState));
  };

  handleToggleInlineStyle = inlineStyle => {
    const newEditorState = RichUtils.toggleInlineStyle(
      this.props.editorState,
      inlineStyle,
    );

    this.props.dispatch(updateContentEditorState(newEditorState));
  };

  handleToggleLinkEntity = () => {
    const { editorState } = this.props;

    if (isEntityInSelection(editorState)) {
      const newEditorState = removeEntityFromSelection(editorState);
      return this.props.dispatch(updateContentEditorState(newEditorState));
    }

    this.props.dispatch(showLinkInput());
  };

  handleSubmitLink = url => {
    const newEditorState = insertEntity(
      this.props.editorState,
      'LINK',
      'MUTABLE',
      { url },
    );
    this.props.dispatch(updateContentEditorState(newEditorState));
    this.props.dispatch(closeLinkInput());
    this.props.dispatch(hideToolbar());
  };

  handleCloseLinkInput = () => {
    this.props.dispatch(closeLinkInput());
  };

  storeDOMRef = ref => {
    this.domRef = ref;
  };

  setLinkRef = ref => {
    this.linkInput = ref;
  };

  render() {
    let blockType;
    const { editorState, show, toolbarPosition } = this.props;
    const selectionStartKey = editorState.getSelection().getStartKey();
    const toolbarStyle = {
      top: toolbarPosition.top,
      left: toolbarPosition.left,
    };

    if (this.width !== 0 && this.height !== 0) {
      Object.assign(toolbarStyle, {
        width: this.width,
        height: this.height,
      });
    }

    if (selectionStartKey) {
      blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selectionStartKey)
        .getType();
    }

    const toolbarClassName =
      show === true || this.props.showLinkInput
        ? Style.editorToolbarActive
        : Style.editorToolbar;

    const ToolbarWrapper = ({ children }) =>
      <div
        className={toolbarClassName}
        style={toolbarStyle}
        ref={this.storeDOMRef}
      >
        {children}
      </div>;

    if (this.props.showLinkInput) {
      return (
        <ToolbarWrapper>
          <EditorLinkInput
            ref={this.setLinkRef}
            value={this.props.linkInputValue}
            onSubmit={this.handleSubmitLink}
            onClose={this.handleCloseLinkInput}
          />
        </ToolbarWrapper>
      );
    }

    return (
      <ToolbarWrapper>
        {INLINE_STYLES.map(type =>
          <EditorStyleButton
            key={type.label}
            label={type.label}
            style={type.style}
            onToggle={this.handleToggleInlineStyle}
            active={editorState.getCurrentInlineStyle().has(type.style)}
          />,
        )}
        <EditorStyleButton
          key={EditorButtonLabel.LINK}
          label={EditorButtonLabel.LINK}
          onToggle={this.handleToggleLinkEntity}
          active={isEntityInSelection(editorState)}
        />
        <EditorToolbarSpacer />
        {BLOCK_STYLES.map(type =>
          <EditorStyleButton
            key={type.label}
            label={type.label}
            style={type.style}
            onToggle={this.handleToggleBlockType}
            active={blockType === type.style}
          />,
        )}
      </ToolbarWrapper>
    );
  }
}

const mapStateToProps = state => ({
  editorState: state.draft.contentEditorState,
  ...state.editorToolbar,
});

export default connect(mapStateToProps, null, null, {
  withRef: true,
})(EditorToolbar);
