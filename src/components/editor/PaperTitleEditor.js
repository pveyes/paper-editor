/* eslint react/jsx-handler-names: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'draft-js';
import './PaperTitleEditor.css';

export default class PaperTitleEditor extends React.Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onReturn: PropTypes.func.isRequired,
  };

  handleReturn = _ => {
    this.props.onReturn();
  };

  handleChange = editorState => {
    this.props.onChange(editorState);
  };

  storeDOMRef = ref => {
    this.domRef = ref;
  };

  render() {
    return (
      <div className="PaperTitleEditor" ref={this.storeDOMRef}>
        <Editor
          placeholder="Title"
          handleReturn={this.handleReturn}
          onChange={this.handleChange}
          editorState={this.props.editorState}
        />
      </div>
    );
  }
}
