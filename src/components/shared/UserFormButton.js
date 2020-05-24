import React from 'react';
import Style from './UserFormButton.css';

export default class UserFormButton extends React.PureComponent {
  props: {
    children: string,
  };

  render() {
    const { children: text, ...props } = this.props;
    return (
      <button className={Style.button} {...props}>
        {text}
      </button>
    );
  }
}
