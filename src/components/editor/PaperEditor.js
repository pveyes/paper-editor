/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import Draft from 'draft-js';
import PaperTitleEditor from './PaperTitleEditor';
import PaperContentEditor from './PaperContentEditor';
import EditorToolbar from './EditorToolbar';
import EditorMedia from './EditorMedia';
import './PaperEditor.css';

import { showToolbar, hideToolbar } from '../../actions/EditorToolbarAction';
import { getReduxAwareRef } from '../../helpers/PaperEditorHelper';

export default class PaperEditor extends React.Component {
  static propTypes = {
    contentEditorState: PropTypes.object.isRequired,
    titleEditorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleTitleChange = titleEditorState => {
    this.props.onChange(titleEditorState, this.props.contentEditorState);
  };

  handleTitleReturn = _ => {
    this.contentEditor.editor.focus();
    return true;
  };

  handleContentChange = contentEditorState => {
    const currentSelection = contentEditorState.getSelection();

    if (currentSelection.isCollapsed()) {
      this.props.dispatch(hideToolbar());
    }

    return this.props.onChange(this.props.titleEditorState, contentEditorState);
  };

  handleContentSelected = contentEditorState => {
    const titleRect = this.titleEditor.domRef.getBoundingClientRect();
    const contentRect = this.contentEditor.domRef.getBoundingClientRect();
    const selectorRect = Draft.getVisibleSelectionRect(window);

    if (selectorRect && this.editorToolbar.domRef) {
      const {
        width: toolbarWidth,
      } = this.editorToolbar.domRef.getBoundingClientRect();

      const top =
        selectorRect.top -
        contentRect.top +
        titleRect.top -
        titleRect.height +
        Math.floor(window.scrollY) -
        // header height
        65;

      const left =
        selectorRect.left -
        contentRect.left -
        toolbarWidth / 2 +
        selectorRect.width / 2;

      this.props.dispatch(showToolbar(top, left));
    }

    this.props.onChange(this.props.titleEditorState, contentEditorState);
  };

  storeEditorToolbarRef = ref => {
    this.editorToolbar = getReduxAwareRef(ref);
  };

  storeTitleEditorRef = ref => {
    this.titleEditor = getReduxAwareRef(ref);
  };

  storeContentEditorRef = ref => {
    this.contentEditor = getReduxAwareRef(ref);
  };

  render() {
    return (
      <div className="PaperEditor">
        <EditorToolbar ref={this.storeEditorToolbarRef} />
        <EditorMedia />
        <PaperTitleEditor
          editorState={this.props.titleEditorState}
          onChange={this.handleTitleChange}
          onReturn={this.handleTitleReturn}
          ref={this.storeTitleEditorRef}
        />
        <PaperContentEditor
          dispatch={this.props.dispatch}
          editorState={this.props.contentEditorState}
          onChange={this.handleContentChange}
          onSelection={this.handleContentSelected}
          ref={this.storeContentEditorRef}
        />
      </div>
    );
  }
}
