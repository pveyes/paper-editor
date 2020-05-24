import React from 'react';
import { PlusIcon } from '../../generic/Icon';
import './EditorRichControl.css';

export default class EditorRichControl extends React.Component {
  handleToggleClick = e => {
    //
  };

  render() {
    return (
      <div>
        <div className="EditorRichControl" onClick={this.handleToggleClick}>
          <PlusIcon />
        </div>
      </div>
    );
  }
}
