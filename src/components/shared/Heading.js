/* eslint react/no-multi-comp: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Style from './Heading.css';

function mergeStyle(...styles) {
  return styles.filter(style => Boolean(style)).join(' ');
}

function createHeading(element, className, properties) {
  const { className: customClassName, children } = properties;

  const props = {
    className: mergeStyle(className, customClassName),
  };

  return React.createElement(element, props, children);
}

export const Hero = props => createHeading('h1', Style.hero, props);
export const H1 = props => createHeading('h1', Style.h1, props);
export const H2 = props => createHeading('h2', Style.h2, props);
export const H3 = props => createHeading('h3', Style.h3, props);

Hero.propTypes = H1.propTypes = H2.propTypes = H3.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
