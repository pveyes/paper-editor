import React from 'react';
import PropTypes from 'prop-types';
import Style from './PostLink.css';

const PostLink = props => {
  const { contentState, entityKey, children: text } = props;

  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a href={url} className={Style.link}>
      {text}
    </a>
  );
};

PostLink.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default PostLink;
