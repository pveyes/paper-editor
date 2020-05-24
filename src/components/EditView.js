import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PaperEditor from './editor/PaperEditor';
import EditorHeader from './edit-post/EditorHeader';
import AppContainer from './shared/AppContainer';
import Flash from '../helpers/FlashState';
import './EditView.css';

import { EDITOR_MODE } from '../constants/PaperEditorConstant';

import {
  initWriteMode,
  loadPost,
  publishPost,
  updateEditorState,
  saveEditorState,
} from '../actions/EditorAction';

const AUTOSAVE_INTERVAL_MS = 500;

class EditView extends React.Component {
  state = {
    // Delay rendering for edit view
    displayed: true,
    published: false,
  };

  static propTypes = {
    route: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    editorMode: PropTypes.string,
    post: PropTypes.object,
    saveStatus: PropTypes.string,
  };

  constructor(...args) {
    super(...args);
    this.autosave = debounce(this.autosave.bind(this), AUTOSAVE_INTERVAL_MS);
  }

  async componentDidMount() {
    // This component handles multiple route entry
    const { route } = this.props;
    if (route.location.pathname === '/write') {
      return this.props.dispatch(initWriteMode());
    }

    this.setState({ displayed: false });
    await this.props.dispatch(loadPost(route.match.params.id));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.post.id) {
      this.setState({ displayed: true });
    }
  }

  async autosave(callback) {
    const post = await this.props.dispatch(saveEditorState());

    if (typeof callback === 'function') {
      return callback(post);
    }
  }

  handleEditorChange = (titleEditorState, contentEditorState) => {
    this.props.dispatch(
      updateEditorState(titleEditorState, contentEditorState),
    );

    if (this.props.editorMode === EDITOR_MODE.WRITE) {
      return this.autosave(post => {
        if (post) {
          // Using History API directly to prevent re-render from React Router
          window.history.replaceState(null, null, `/edit/${post.id}`);
        }
      });
    }

    this.autosave();
  };

  handlePublish = async () => {
    try {
      await this.props.dispatch(publishPost());
      Flash.set('message', 'Post successfully published');
      this.setState({ published: true });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    if (this.state.published === true) {
      return <Redirect push to="/" />;
    }

    return (
      <div className="EditView">
        <EditorHeader
          post={this.props.post}
          saveStatus={this.props.saveStatus}
          onPublish={this.handlePublish}
        />
        {this.state.displayed &&
          <AppContainer>
            <PaperEditor
              titleEditorState={this.props.post.titleEditorState}
              contentEditorState={this.props.post.contentEditorState}
              onChange={this.handleEditorChange}
              dispatch={this.props.dispatch}
            />
          </AppContainer>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    post: state.draft,
    editorMode: state.editorMode,
    saveStatus: state.saveStatus,
    publishOptionMode: state.publishOptionMode,
  };
}

export default connect(mapStateToProps)(EditView);
