import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Style from './Text.css';

const Text = ({
  primary,
  inline,
  className: customClassName,
  children,
  ...props
}) => {
  let defaultClassName = primary ? Style.primary : Style.default;

  if (inline) {
    defaultClassName = Style.inline;
  }

  const className = cx(defaultClassName, customClassName);
  return (
    <span {...{ className, ...props }}>
      {children}
    </span>
  );
};

Text.propTypes = {
  primary: PropTypes.bool,
  inline: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Text;
