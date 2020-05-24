import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostPublishOption from './PostPublishOption';
import PostVisiblityOption from './PostVisibilityOption';
import PostMetaOption from './PostMetaOption';
import ChromelessButton from '../shared/ChromelessButton';
import Text from '../shared/Text';
import Style from './EditorPublishButton.css';
import {
  PUBLISH_OPTION_MODE,
  VISIBILITY_OPTION,
} from '../../constants/PaperEditorConstant';

import {
  clearPublishOption,
  togglePublishOptionPopover,
} from '../../actions/EditorAction';

class EditorPublishButton extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    popoverMode: PropTypes.string.isRequired,
    popoverActive: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    visibilityOption: PropTypes.string.isRequired,
    onPublish: PropTypes.func.isRequired,
  };

  handleButtonClicked = e => {
    this.props.dispatch(togglePublishOptionPopover());
  };

  handlePublish = e => {
    this.props.dispatch(togglePublishOptionPopover());
    this.props.onPublish();
  };

  storeDomRef = ref => {
    this.dom = ref;
  };

  renderPublishOption() {
    const popoverProps = {
      style: {
        top: 65,
        right: -116,
        width: '320px',
      },
      active: this.props.popoverActive,
      onClose: e => {
        if (!this.dom.contains(e.target) && this.props.popoverActive) {
          this.props.dispatch(
            clearPublishOption({
              resetData: true,
              closePopover: true,
            }),
          );
        }
      },
    };

    const props = {
      popover: popoverProps,
      post: this.props.post,
      dispatch: this.props.dispatch,
    };

    switch (this.props.popoverMode) {
      case PUBLISH_OPTION_MODE.VISIBILITY_OPTION:
        return (
          <PostVisiblityOption
            {...props}
            visibilityOption={this.props.visibilityOption}
          />
        );
      case PUBLISH_OPTION_MODE.CUSTOM_META:
        return (
          <PostMetaOption
            {...props}
            meta={this.props.post.meta}
            customMeta={this.props.post.customMeta}
          />
        );
      default:
        // PUBLISH_OPTION_MODE.PUBLISH
        return (
          <PostPublishOption
            {...props}
            onPublish={this.handlePublish}
            tags={this.props.post.tags}
          />
        );
    }
  }

  render() {
    const editorPublishOption = this.renderPublishOption();

    return (
      <ChromelessButton
        className={Style.button}
        domRef={this.storeDomRef}
        useGenericElement
      >
        <div onClick={this.handleButtonClicked}>
          <Text primary className={Style.text}>
            {'Publish'}
          </Text>
          <span className={Style.arrow}>
            <svg width="19" height="19" viewBox="0 0 19 19">
              <path
                d="M3.9 6.772l5.205 5.756.427.472.427-.472 5.155-5.698-.854-.772-4.728 5.254L4.753 6z"
                fillRule="evenodd"
              />
            </svg>
          </span>
        </div>
        {editorPublishOption}
      </ChromelessButton>
    );
  }
}

function mapStateToProps(state) {
  return {
    popoverMode: state.publishOption.mode,
    popoverActive: state.publishOption.active,
    visibilityOption: state.draft.visible
      ? VISIBILITY_OPTION.VISIBLE
      : VISIBILITY_OPTION.UNLISTED,
  };
}

export default connect(mapStateToProps)(EditorPublishButton);
