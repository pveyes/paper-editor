import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Style from './ChromelessButton.css';

export default class ChromelessButton extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    useGenericElement: PropTypes.bool,
    domRef: PropTypes.func,
  };

  storeDomRef = ref => {
    if (this.props.domRef) {
      return this.props.domRef(ref);
    }

    this.dom = ref;
  };

  render() {
    const {
      className: customClassName,
      children,
      domRef,
      useGenericElement,
      ...props
    } = this.props;

    if (useGenericElement) {
      const className = cx(Style.generic, customClassName);
      return (
        <div {...{ className, ...props }} ref={domRef}>
          {children}
        </div>
      );
    }

    const className = cx(Style.button, customClassName);
    return (
      <button {...{ className, ...props }} ref={domRef}>
        {children}
      </button>
    );
  }
}
