import React from 'react';
import PropTypes from 'prop-types';

export default class AutoresizeTextarea extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  };

  componentDidMount() {
    this._mounted = true;
    this._recalculateHeight();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleChange = e => {
    this._recalculateHeight();

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e);
    }
  };

  storeDomRef = ref => {
    this.dom = ref;
  };

  _recalculateHeight = () => {
    window.requestAnimationFrame(() => {
      if (this._mounted) {
        this.dom.style.height = 'auto';
        this.dom.style.height = this.dom.scrollHeight + 'px';
      }
    });
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onChange, ...props } = this.props;
    return (
      <textarea
        {...props}
        onChange={this.handleChange}
        ref={this.storeDomRef}
      />
    );
  }
}
