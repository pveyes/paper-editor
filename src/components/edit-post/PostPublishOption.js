import React from 'react';
import PropTypes from 'prop-types';
import Popover from '../shared/Popover';
import ButtonAction from '../shared/ButtonAction';
import RoundLink from '../shared/RoundLink';
import AutoresizeTextarea from '../shared/AutoresizeTextarea';
import Style from './PostPublishOption.css';

import { PUBLISH_OPTION_MODE } from '../../constants/PaperEditorConstant';

import {
  changePublishOptionMode,
  updateDraftTags,
} from '../../actions/EditorAction';

export default class EditorPublishOption extends React.Component {
  static propTypes = {
    popover: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    tags: PropTypes.string,
    onPublish: PropTypes.func.isRequired,
  };

  handleTagChange = e => {
    this.props.dispatch(updateDraftTags(e.target.value));
  };

  handleChangeVisibilityMode = e => {
    this.props.dispatch(
      changePublishOptionMode(PUBLISH_OPTION_MODE.VISIBILITY_OPTION),
    );
  };

  handleChangeMetaMode = e => {
    this.props.dispatch(
      changePublishOptionMode(PUBLISH_OPTION_MODE.CUSTOM_META),
    );
  };

  handlePublish = e => {
    this.props.onPublish();
  };

  render() {
    const { popover: popoverProps, post } = this.props;
    const visibility = post.visible ? 'Public' : 'Unlisted';
    const metaTagStatus = post.customMeta ? 'Custom' : 'Default';

    return (
      <Popover {...popoverProps}>
        <div className={Style.publishTitle}>
          {'Ready to publish?'}
        </div>
        <div>
          {'Add or change tags (up to 5) so your post reaches more people:'}
        </div>
        <AutoresizeTextarea
          className={Style.tagInput}
          onChange={this.handleTagChange}
          value={this.props.tags}
        />
        <div className={Style.publishButtonFooter}>
          <div>
            <ButtonAction onClick={this.handleChangeVisibilityMode}>
              {`Visibility: ${visibility}`}
            </ButtonAction>
            <ButtonAction onClick={this.handleChangeMetaMode}>
              {`Meta tags: ${metaTagStatus}`}
            </ButtonAction>
          </div>
          <RoundLink type="primary" onClick={this.handlePublish}>
            {'Publish'}
          </RoundLink>
        </div>
      </Popover>
    );
  }
}
