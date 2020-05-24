import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Render default anchor tag or react-router Link
 */
const HybridLink = ({ children, linkTo, href, ...props }) => {
  if (linkTo) {
    return (
      <Link to={linkTo} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

HybridLink.propTypes = {
  linkTo: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
};

export default HybridLink;
