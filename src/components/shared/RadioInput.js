import React from 'react';
import PropTypes from 'prop-types';
import Style from './RadioInput.css';

export default class RadioInput extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    text: PropTypes.string,
    children: PropTypes.node,
    value: PropTypes.string.isRequired,
  };

  handleClick = e => {
    this.props.onSelect(this.props.value);
  };

  render() {
    const radioStyle = this.props.selected ? Style.radioSelected : Style.radio;

    return (
      <div onClick={this.handleClick} className={Style.container}>
        <div className={radioStyle} />
        <div className={Style.display}>
          {this.props.text}
          {this.props.children}
        </div>
      </div>
    );
  }
}
