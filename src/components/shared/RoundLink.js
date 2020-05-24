import React from 'react';
import PropTypes from 'prop-types';
import Style from './RoundLink.css';
import cx from 'classnames';
import HybridLink from './router/HybridLink';

const RoundLink = ({
  linkTo,
  href,
  className: customClassName,
  children,
  type,
  ...props
}) => {
  let defaultClass;

  switch (type) {
    case 'primary':
      defaultClass = Style.primary;
      break;
    default:
      defaultClass = Style.link;
  }

  const className = cx(defaultClass, customClassName);

  return (
    <HybridLink {...{ linkTo, href, className, ...props }}>
      {children}
    </HybridLink>
  );
};

RoundLink.propTypes = {
  type: PropTypes.oneOf(['primary']),
  href: PropTypes.string,
  linkTo: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default RoundLink;
