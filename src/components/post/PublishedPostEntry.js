import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PostEditEntry from './PostEditEntry';
import UnlistedIcon from '../shared/UnlistedIcon';
import CenterDotSpacer from '../shared/CenterDotSpacer';

export default class PublishedPostEntry extends React.Component {
  static propTypes = {
    post: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      stats: PropTypes.shape({
        time: PropTypes.number,
        words: PropTypes.number,
      }),
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    }),
    onDelete: PropTypes.func,
  };

  state = {};

  render() {
    const {
      post,
      post: { excerpt, publishedAt, updatedAt, editedAt, stats },
    } = this.props;
    const timestampText = `Published ${moment(publishedAt).fromNow()}`;
    const statsText = `${Math.ceil(stats.time / 60)} min read`;
    const unpublishedChanges = editedAt && updatedAt !== editedAt;
    const smallExcerpt =
      excerpt.split(' ').length >= 25
        ? excerpt.split(' ').splice(0, 25).join(' ') + '...'
        : excerpt;

    return (
      <PostEditEntry post={post} onDelete={this.props.onDelete}>
        <div className="PostEditEntry-smallExcerpt">
          {smallExcerpt}
        </div>
        {!post.visible && [
          <span
            key="unlisted"
            className="PostEditEntry-meta PostEditEntry-unlisted"
          >
            <UnlistedIcon />
            {'Unlisted'}
          </span>,
          <CenterDotSpacer key="unlisted-spacer" />,
        ]}
        <span className="PostEditEntry-meta">
          {timestampText}
        </span>
        <CenterDotSpacer />
        <span key="stats" className="PostEditEntry-meta">
          {statsText}
        </span>
        {unpublishedChanges && [
          <CenterDotSpacer key="unpublished-spacer" />,
          <span key="unpublished" className="PostEditEntry-meta">
            {'Unpublished changes'}
          </span>,
        ]}
      </PostEditEntry>
    );
  }
}
