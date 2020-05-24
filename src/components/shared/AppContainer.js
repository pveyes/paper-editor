import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Style from './AppContainer.css';

const AppContainer = ({ wide, className: customClassName, children }) => {
  const defaultClassName = wide ? Style.wide : Style.default;
  const className = cx(defaultClassName, customClassName);

  return (
    <div className={className}>
      {children}
    </div>
  );
};

AppContainer.propTypes = {
  wide: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default AppContainer;
