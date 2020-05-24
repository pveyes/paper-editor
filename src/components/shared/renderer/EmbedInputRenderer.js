import React from 'react';
import { EditorBlock } from 'draft-js';
import Style from './EmbedInputRenderer.css';

export default class EmbedInputRenderer extends React.Component {
  props: {
    block: Object,
    blockProps: Object,
  };

  render() {
    const text = this.props.block.getText();
    const placeholderText = this.props.blockProps.placeholder;

    const placeholder = text
      ? null
      : <div className={Style.placeholder}>
          {placeholderText}
        </div>;

    return (
      <div style={{ position: 'relative' }}>
        {placeholder}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <EditorBlock {...this.props} />
        </div>
      </div>
    );
  }
}
