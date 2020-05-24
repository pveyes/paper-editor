// @flow
import React from 'react';
import './EditorLinkInput.css';

type Props = {
  onSubmit: string => void,
  onClose: () => void,
};

export default class EditorLinkInput extends React.Component {
  props: Props;

  state = {
    value: '',
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  handleKeyDown = e => {
    if (e.which === 13) {
      // ENTER
      this.props.onSubmit(this.state.value);
      return true;
    } else if (e.which === 27) {
      // ESC
      this.props.onClose();
      return true;
    }

    return false;
  };

  componentDidMount() {
    this.input.focus();
  }

  render() {
    return (
      <input
        className="EditorLinkInput"
        value={this.state.value}
        placeholder={'Paste or type a link...'}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        spellCheck={false}
        ref={input => (this.input = input)}
      />
    );
  }
}
