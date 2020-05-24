import React from 'react';
import PropTypes from 'prop-types';
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  Heading1Icon,
  Heading2Icon,
  BlockquoteIcon,
  CodeBlockIcon,
} from '../shared/Icon';
import './EditorStyleButton.css';

export const EditorButtonLabel = {
  BOLD: 'bold',
  ITALIC: 'italic',
  LINK: 'link',
  H1: 'h1',
  H2: 'h2',
  BLOCKQUOTE: 'blockquote',
  CODE: 'code-block',
};

export default class EditorStyleButton extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    style: PropTypes.string,
  };

  handleToggle = e => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    let Icon;

    switch (this.props.label) {
      case EditorButtonLabel.BOLD: {
        Icon = BoldIcon;
        break;
      }
      case EditorButtonLabel.ITALIC: {
        Icon = ItalicIcon;
        break;
      }
      case EditorButtonLabel.LINK: {
        Icon = LinkIcon;
        break;
      }
      case EditorButtonLabel.H1: {
        Icon = Heading1Icon;
        break;
      }
      case EditorButtonLabel.H2: {
        Icon = Heading2Icon;
        break;
      }
      case EditorButtonLabel.BLOCKQUOTE: {
        Icon = BlockquoteIcon;
        break;
      }
      case EditorButtonLabel.CODE: {
        Icon = CodeBlockIcon;
        break;
      }
      default: {
        Icon = undefined;
      }
    }

    return (
      <div className="EditorStyleButton" onMouseDown={this.handleToggle}>
        <Icon active={this.props.active} />
      </div>
    );
  }
}
