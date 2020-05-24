import React from 'react';
import PropTypes from 'prop-types';
import Style from './IframeEmbed.css';

export const STYLE_OVERRIDE = `
<style>
  body { margin: 0 !important }
  .gist, .gist-file { margin-bottom: 0 !important }
  .gist { text-rendering: auto }
</style>
`;

export default class IframeEmbed extends React.Component {
  static propTypes = {
    children: PropTypes.string,
    src: PropTypes.string,
  };

  handleLoad = () => {
    setTimeout(() => {
      this.iframe.style.height =
        this.iframe.contentWindow.document.body.scrollHeight + 'px';
    }, 100);
  };

  storeIframeRef = ref => {
    this.iframe = ref;
  };

  render() {
    const srcDoc = this.props.children
      ? STYLE_OVERRIDE + this.props.children
      : null;

    return (
      // eslint-disable-next-line jsx-a11y/iframe-has-title
      <iframe
        className={Style.iframe}
        srcDoc={srcDoc}
        onLoad={this.handleLoad}
        src={this.props.src}
        ref={this.storeIframeRef}
      />
    );
  }
}
