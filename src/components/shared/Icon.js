/* eslint react/no-multi-comp: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Style from './Icon.css';

const IconPropTypes = { active: PropTypes.bool };

export const Icon = props => {
  const className = classnames({
    [props.className]: true,
    [Style.active]: props.active,
  });

  return <span className={className} aria-hidden />;
};

Icon.displayName = 'Icon';
Icon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string.isRequired,
};

export const BoldIcon = props => {
  return <Icon className={Style.bold} active={props.active} />;
};

BoldIcon.displayName = 'BoldIcon';
BoldIcon.propTypes = IconPropTypes;

export const ItalicIcon = props => {
  return <Icon className={Style.italic} active={props.active} />;
};

ItalicIcon.displayName = 'ItalicIcon';
ItalicIcon.propTypes = IconPropTypes;

export const LinkIcon = props => {
  return <Icon className={Style.link} active={props.active} />;
};

LinkIcon.displayName = 'LinkIcon';
LinkIcon.propTypes = IconPropTypes;

export const Heading1Icon = props => {
  return <Icon className={Style.h1} active={props.active} />;
};

Heading1Icon.displayName = 'Heading1Icon';
Heading1Icon.propTypes = IconPropTypes;

export const Heading2Icon = props => {
  return <Icon className={Style.h2} active={props.active} />;
};

Heading2Icon.displayName = 'Heading2Icon';
Heading2Icon.propTypes = IconPropTypes;

export const BlockquoteIcon = props => {
  return <Icon className={Style.blockquote} active={props.active} />;
};

BlockquoteIcon.displayName = 'BlockquoteIcon';
BlockquoteIcon.propTypes = IconPropTypes;

export const CodeBlockIcon = props => {
  return <Icon className={Style.codeBlock} active={props.active} />;
};

CodeBlockIcon.displayName = 'CodeBlockIcon';
CodeBlockIcon.propTypes = IconPropTypes;
