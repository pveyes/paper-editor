import React from 'react';
import PropTypes from 'prop-types';

const PostEmbed = props =>
  <div>
    {`Unsupported embed ${props.url}`}
  </div>;

PostEmbed.propTypes = {
  url: PropTypes.string,
};

export default PostEmbed;
