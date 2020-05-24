import React from 'react';
import PropTypes from 'prop-types';
import Popover from '../shared/Popover';
import RoundLink from '../shared/RoundLink';
import RadioInput from '../shared/RadioInput';
import ChromelessButton from '../shared/ChromelessButton';
import AutoresizeTextarea from '../shared/AutoresizeTextarea';
import './PostMetaOption.css';

import {
  changeDraftMeta,
  clearPublishOption,
  saveEditorState,
  toggleCustomMeta,
} from '../../actions/EditorAction';

export default class PostMetaOption extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    popover: PropTypes.object.isRequired,
    meta: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    customMeta: PropTypes.bool,
  };

  handleEnableCustomMeta = status => {
    this.props.dispatch(toggleCustomMeta(status === 'enabled'));
  };

  handleChangeDescription = e => {
    this.handleChangeMeta(this.props.meta.title, e.target.value);
  };

  handleChangeTitle = e => {
    this.handleChangeMeta(e.target.value, this.props.meta.description);
  };

  handleChangeMeta = (title, description) => {
    this.props.dispatch(changeDraftMeta(title, description));
  };

  handleSubmitMeta = () => {
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

    let customMetaForm;
    if (this.props.customMeta) {
      customMetaForm = (
        <div className="PostMetaOption-form">
          <div className="Popover-field">
            <label htmlFor="meta-title">
              {'Title'}
            </label>
            <input
              type="text"
              placeholder="Custom meta title"
              value={this.props.meta.title}
              onChange={this.handleChangeTitle}
            />
          </div>
          <div className="Popover-field" style={{ marginBottom: '20px' }}>
            <label htmlFor="meta-title">
              {'Description'}
            </label>
            <AutoresizeTextarea
              type="text"
              placeholder="Custom meta description (ideally between 150 - 160 characters)"
              value={this.props.meta.description}
              onChange={this.handleChangeDescription}
            />
          </div>
        </div>
      );
    } else {
      customMetaForm = <div className="PostMetaOption-form" />;
    }

    return (
      <Popover {...popoverProps}>
        <RadioInput
          text="Default meta tags"
          value={'disabled'}
          selected={!this.props.customMeta}
          onSelect={this.handleEnableCustomMeta}
        />
        <RadioInput
          text="Custom title and description"
          value={'enabled'}
          selected={this.props.customMeta}
          onSelect={this.handleEnableCustomMeta}
        />
        {customMetaForm}
        <RoundLink onClick={this.handleSubmitMeta}>
          {'Save'}
        </RoundLink>
        <ChromelessButton
          onClick={this.handleCancel}
          style={{ marginLeft: '10px' }}
        >
          {'Cancel'}
        </ChromelessButton>
      </Popover>
    );
  }
}
