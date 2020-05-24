import React from 'react';
import PropTypes from 'prop-types';
import IframeEmbed from './IframeEmbed';

const GithubGist = props => {
  const { url } = props;

  return (
    <IframeEmbed>
      {`<script type='text/javascript' src='${url}.js'></script>`}
    </IframeEmbed>
  );
};

GithubGist.propTypes = {
  url: PropTypes.string.isRequired,
};

export default GithubGist;
