import React from 'react';
import Style from './UserFormInput.css';

export default class UserFormInput extends React.PureComponent {
  render() {
    return <input className={Style.input} {...this.props} />;
  }
}
