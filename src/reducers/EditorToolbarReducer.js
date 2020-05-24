import { combineReducers } from 'redux';

import {
  SHOW_TOOLBAR,
  HIDE_TOOLBAR,
  CLOSE_LINK_INPUT,
  SHOW_LINK_INPUT,
} from '../actions/EditorToolbarAction';

const show = (state = false, action) => {
  switch (action.type) {
    case HIDE_TOOLBAR:
      return false;
    case SHOW_TOOLBAR:
      return true;
    default:
      return state;
  }
};

const ToolbarPositionState = {
  top: 0,
  left: 0,
};

const toolbarPosition = (state = ToolbarPositionState, action) => {
  switch (action.type) {
    case SHOW_TOOLBAR:
      return {
        top: action.top,
        left: action.left,
      };
    case HIDE_TOOLBAR:
      return ToolbarPositionState;
    default:
      return state;
  }
};

const showLinkInput = (state = false, action) => {
  switch (action.type) {
    case SHOW_LINK_INPUT:
      return true;
    case CLOSE_LINK_INPUT:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  show,
  toolbarPosition,
  showLinkInput,
});
