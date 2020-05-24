import React from 'react';
import PropTypes from 'prop-types';
import Style from './PostImage.css';

const PostImage = props => {
  const { src } = props;

  return (
    // eslint-disable-next-line
    <img src={src} className={Style.image} role="presentation" />
  );
};

PostImage.propTypes = {
  src: PropTypes.string.isRequired,
};

export default PostImage;
