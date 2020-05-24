import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { H3 } from '../shared/Heading';
import CenterDotSpacer from '../shared/CenterDotSpacer';
import './PostEditEntry.css';

const DEFAULT_TITLE = 'Untitled Post';

export default class PostEditEntry extends React.Component {
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
    children: PropTypes.node,
    onDelete: PropTypes.func,
  };

  state = {};

  handleDeletePost = e => {
    e.preventDefault();
    this.props.onDelete(this.props.post);
  };

  render() {
    const title = this.props.post.title || DEFAULT_TITLE;
    const { id: postId } = this.props.post;

    return (
      <div className="PostEditEntry">
        <H3 className="PostEditEntry-title">
          {title}
        </H3>
        <div className="PostEditEntry-container">
          {this.props.children}
          <CenterDotSpacer />
          <Link to={`/edit/${postId}`} className="PostEditEntry-actionEdit">
            {'Edit'}
          </Link>
          <CenterDotSpacer />
          <a
            href="#delete"
            className="PostEditEntry-actionDelete"
            onClick={this.handleDeletePost}
          >
            {'Delete'}
          </a>
        </div>
      </div>
    );
  }
}
