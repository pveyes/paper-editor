import React from 'react';
import PropTypes from 'prop-types';
import Style from './ButtonAction.css';

const ButtonAction = props => {
  const { children, onClick, ...rest } = props;

  function handleClick(e) {
    e.preventDefault();
    return onClick(e);
  }

  const buttonProps = {
    className: Style.button,
    onClick: handleClick,
    ...rest,
  };

  return (
    <button {...buttonProps}>
      {children}
    </button>
  );
};

ButtonAction.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ButtonAction;
