import { combineReducers } from 'redux';
import {
  SELECT_EMBED_WITH_ENTITY,
  CLEAR_SELECT_EMBED_WITH_ENTITY,
} from '../actions/EditorEmbedAction';

const activeEntity = (state = null, action) => {
  switch (action.type) {
    case SELECT_EMBED_WITH_ENTITY:
      return action.entity;
    case CLEAR_SELECT_EMBED_WITH_ENTITY:
      return null;
    default:
      return state;
  }
};

const activeBlock = (state = null, action) => {
  switch (action.type) {
    case SELECT_EMBED_WITH_ENTITY:
      return action.block;
    case CLEAR_SELECT_EMBED_WITH_ENTITY:
      return null;
    default:
      return state;
  }
};

export default combineReducers({
  activeEntity,
  activeBlock,
});
