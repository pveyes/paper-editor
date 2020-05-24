import React from 'react';
import PropTypes from 'prop-types';
import Style from './Popover.css';

export default class Popover extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    active: PropTypes.bool,
    onClose: PropTypes.func,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleClick = e => {
    e.stopPropagation();
  };

  handleDocumentClick = e => {
    if (!this.dom.contains(e.target)) {
      this.props.onClose(e);
    }
  };

  storeDomRef = ref => {
    this.dom = ref;
  };

  render() {
    const containerClass = this.props.active
      ? Style.containerActive
      : Style.container;
    const containerProps = {
      className: containerClass,
      style: this.props.style,
      onClick: this.handleClick,
      ref: this.storeDomRef,
    };

    return (
      <div {...containerProps}>
        <div className={Style.arrow} />
        <div className={Style.inner}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
