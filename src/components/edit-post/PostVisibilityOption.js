import React from 'react';
import PropTypes from 'prop-types';
import Popover from '../shared/Popover';
import RadioInput from '../shared/RadioInput';
import RoundLink from '../shared/RoundLink';
import UnlistedIcon from '../shared/UnlistedIcon';
import ChromelessButton from '../shared/ChromelessButton';
import './PostVisibilityOption.css';

import { VISIBILITY_OPTION } from '../../constants/PaperEditorConstant';

import {
  changeVisibilityOption,
  clearPublishOption,
  saveEditorState,
} from '../../actions/EditorAction';

export default class PostVisiblityOption extends React.Component {
  static propTypes = {
    popover: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    visibilityOption: PropTypes.string.isRequired,
  };

  handleChange = visibilityOption => {
    this.props.dispatch(changeVisibilityOption(visibilityOption));
  };

  handleSaveVisibilityOption = () => {
    this.props.dispatch(saveEditorState(true));
    this.props.dispatch(
      clearPublishOption({
        resetData: false,
        closePopover: false,
      }),
    );
  };

  handleCancel = () => {
    this.props.dispatch(
      clearPublishOption({
        resetData: true,
        closePopover: false,
      }),
    );
  };

  render() {
    const { popover: popoverProps } = this.props;
    const explainText =
      this.props.visibilityOption === VISIBILITY_OPTION.VISIBLE
        ? 'This post will be public. Everyone can see it in your blog homepage'
        : "This post will only be visible to those with the link. It won't be listed in your blog homepage";

    return (
      <Popover {...popoverProps}>
        <RadioInput
          text={'Public'}
          value={VISIBILITY_OPTION.VISIBLE}
          selected={this.props.visibilityOption === VISIBILITY_OPTION.VISIBLE}
          onSelect={this.handleChange}
        />
        <RadioInput
          value={VISIBILITY_OPTION.UNLISTED}
          selected={this.props.visibilityOption === VISIBILITY_OPTION.UNLISTED}
          onSelect={this.handleChange}
        >
          <UnlistedIcon />
          {'Unlisted'}
        </RadioInput>
        <div className={'PostVisibilityOption-explainText'}>
          {explainText}
        </div>
        <RoundLink onClick={this.handleSaveVisibilityOption}>
          {'Save'}
        </RoundLink>
        <ChromelessButton
          style={{ margin: '0 10px' }}
          onClick={this.handleCancel}
        >
          {'Cancel'}
        </ChromelessButton>
      </Popover>
    );
  }
}
