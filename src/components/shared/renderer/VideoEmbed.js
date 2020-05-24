import React from 'react';
import PropTypes from 'prop-types';
import IframeEmbed from './IframeEmbed';
import Style from './VideoEmbed.css';

/**
 * Wrap iframe inside a wrapper to get auto resize feature
 * @see https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
 */
const VideoEmbed = props => {
  const { url } = props;

  return (
    <div className={Style.wrapper}>
      <IframeEmbed src={url} />
    </div>
  );
};

VideoEmbed.propTypes = {
  url: PropTypes.string.isRequired,
};

export default VideoEmbed;
