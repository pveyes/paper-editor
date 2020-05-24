import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PostEditEntry from './PostEditEntry';
import CenterDotSpacer from '../shared/CenterDotSpacer';

export default class DraftPostEntry extends React.Component {
  static propTypes = {
    post: PropTypes.object,
    onDelete: PropTypes.func,
  };

  render() {
    const { post, post: { createdAt, updatedAt, stats } } = this.props;

    let timestampText = `Created ${moment(createdAt).fromNow()}`;
    if (updatedAt) {
      timestampText = `Last edited ${moment(updatedAt).fromNow()}`;
    }

    let statsText;
    const showStats = stats && stats.words > 0;
    if (showStats) {
      const wordText = stats.words === 1 ? '1 word' : `${stats.words} words`;
      statsText = `${Math.ceil(stats.time / 60)} min read (${wordText}) so far`;
    }

    return (
      <PostEditEntry post={post} onDelete={this.props.onDelete}>
        <span className="PostEditEntry-meta">
          {timestampText}
        </span>
        {showStats && [
          <CenterDotSpacer key="stats-spacer" />,
          <span key="stats" className="PostEditEntry-meta">
            {statsText}
          </span>,
        ]}
      </PostEditEntry>
    );
  }
}
