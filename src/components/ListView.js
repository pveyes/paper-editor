import React from 'react';
import MainHeader from './shared/MainHeader';
import { Hero } from './shared/Heading';
import AppContainer from './shared/AppContainer';
import RoundLink from './shared/RoundLink';
import DraftPostEntry from './post/DraftPostEntry';
import PublishedPostEntry from './post/PublishedPostEntry';
import Post from '../api/PostService';
import Flash from '../helpers/FlashState';
import Style from './ListView.css';

const CATEGORY = {
  DRAFT: 'draft',
  PUBLIC: 'public',
  UNLISTED: 'unlisted',
};

export default class ListView extends React.Component {
  state = {
    posts: [],
    drafts: [],
    publicPost: [],
    activePost: [],
    unlistedPost: [],
    selectedCategory: CATEGORY.DRAFT,
    message: null,
  };

  async componentDidMount() {
    document.title = 'Paper Dashboard';
    await this.getData();
  }

  async getData() {
    this.setState({ message: Flash.get('message') });

    try {
      const { posts } = await Post.getAll();
      const drafts = posts.filter(post => post.publishedAt === undefined);
      const publicPost = posts.filter(
        post => post.publishedAt !== undefined && post.visible,
      );
      const unlistedPost = posts.filter(
        post => post.publishedAt !== undefined && !post.visible,
      );
      const activePost = this._getActivePost(this.state.selectedCategory, {
        drafts,
        publicPost,
        unlistedPost,
      });

      this.setState({ posts, drafts, publicPost, unlistedPost, activePost });
    } catch (err) {
      this.props.onApiError(err);
    }
  }

  handleChangeCategory(selectedCategory) {
    const activePost = this._getActivePost(selectedCategory);
    return e => {
      this.setState({ selectedCategory, activePost });
    };
  }

  handleDeletePost = async post => {
    try {
      const { id } = post;
      await Post.delete(id);
      await this.getData();
    } catch (err) {
      console.error(err);
    }
  };

  _getActivePost(selectedCategory, state = this.state) {
    switch (selectedCategory) {
      case CATEGORY.DRAFT:
        return state.drafts;
      case CATEGORY.UNLISTED:
        return state.unlistedPost;
      case CATEGORY.PUBLIC:
        return state.publicPost;
      default:
        return state.drafts;
    }
  }

  _getStyleForCategory(category) {
    return this.state.selectedCategory === category
      ? Style.categoryClassNameActive
      : Style.categoryClassName;
  }

  render() {
    const PostListEntry =
      this.state.selectedCategory === CATEGORY.DRAFT
        ? DraftPostEntry
        : PublishedPostEntry;

    const { message } = this.state;

    return (
      <div>
        <MainHeader />
        <AppContainer wide>
          <Hero>
            {'Your Writings'}
          </Hero>
          {message &&
            <div className="ListView-flash">
              <span>
                {message}
              </span>
            </div>}
          <div className="ListView-buttonSet">
            <RoundLink href="#/" style={{ marginRight: '8px' }}>
              {'Open your blog'}
            </RoundLink>
            <RoundLink
              type="primary"
              linkTo="/write"
              className="ListView-actionCreate"
            >
              {'Write new post'}
            </RoundLink>
          </div>
          <nav className="PostList-category">
            <a
              onClick={this.handleChangeCategory(CATEGORY.DRAFT)}
              className={this._getStyleForCategory(CATEGORY.DRAFT)}
            >
              {'Drafts'}
              <span className="PostList-categoryCount">
                {this.state.drafts.length}
              </span>
            </a>
            <a
              onClick={this.handleChangeCategory(CATEGORY.PUBLIC)}
              className={this._getStyleForCategory(CATEGORY.PUBLIC)}
            >
              {'Public'}
              <span className="PostList-categoryCount">
                {this.state.publicPost.length}
              </span>
            </a>
            <a
              onClick={this.handleChangeCategory(CATEGORY.UNLISTED)}
              className={this._getStyleForCategory(CATEGORY.UNLISTED)}
            >
              {'Unlisted'}
              <span className="PostList-categoryCount">
                {this.state.unlistedPost.length}
              </span>
            </a>
          </nav>
          <div className="PostList">
            {this.state.activePost.map(post =>
              <PostListEntry
                key={post.id}
                post={post}
                onDelete={this.handleDeletePost}
              />,
            )}
          </div>
        </AppContainer>
      </div>
    );
  }
}
