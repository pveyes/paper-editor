import React from 'react';
import PropTypes from 'prop-types';
import EditorPublishButton from './EditorPublishButton';
import ChromelessButton from '../shared/ChromelessButton';
import AppContainer from '../shared/AppContainer';
import Header from '../shared/Header';
import Text from '../shared/Text';
import Style from './EditorHeader.css';
import { SAVE_STATUS } from '../../constants/PaperEditorConstant';

export default class EditorHeader extends React.Component {
  static propTypes = {
    post: PropTypes.object,
    saveStatus: PropTypes.string,
    onPublish: PropTypes.func.isRequired,
  };

  getSaveStatus(saveStatus) {
    let saveStatusText;
    let saveStatusClassName;

    switch (saveStatus) {
      case SAVE_STATUS.SAVED:
        saveStatusText = 'Saved';
        saveStatusClassName = Style.saveStatusDone;
        break;
      case SAVE_STATUS.SAVING:
        saveStatusText = 'Saving...';
        saveStatusClassName = Style.saveStatus;
        break;
      default:
        saveStatusText = '';
        saveStatusClassName = Style.saveStatus;
        break;
    }

    return {
      saveStatusText,
      saveStatusClassName,
    };
  }

  render() {
    const { saveStatusClassName, saveStatusText } = this.getSaveStatus(
      this.props.saveStatus,
    );

    return (
      <Header withBorder className="EditorHeader">
        <AppContainer wide className="EditorHeader-container">
          <div className={saveStatusClassName}>
            {saveStatusText}
          </div>
          <div className="editorTools">
            <ChromelessButton className={Style.headerTextAction}>
              <Text style={{ verticalAlign: 'middle' }}>
                {'Share'}
              </Text>
            </ChromelessButton>
            <EditorPublishButton
              post={this.props.post}
              onPublish={this.props.onPublish}
            />
          </div>
        </AppContainer>
      </Header>
    );
  }
}
