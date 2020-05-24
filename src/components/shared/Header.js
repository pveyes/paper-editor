import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './Header.css';

export default class Header extends React.Component {
  static propTypes = {
    withBorder: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
  };

  state = {};

  render() {
    const defaultClassName = this.props.withBorder
      ? 'Header--withBorder'
      : 'Header';
    const className = cx(defaultClassName, this.props.className);

    return (
      <header className={className}>
        {this.props.children}
      </header>
    );
  }
}
