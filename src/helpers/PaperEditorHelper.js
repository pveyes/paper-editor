import { EditorState, CompositeDecorator, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { ENTITY_TYPES, STYLE_MAP } from '../constants/PaperEditorConstant';
import { renderHtmlAtomic } from './PaperAtomicBlockHelper';
import PostLink from '../components/shared/renderer/PostLink';

import { getCurrentBlock } from './DraftEditorHelper';

export const decorator = new CompositeDecorator([
  {
    strategy: createEntityFinderStrategy(ENTITY_TYPES.LINK),
    component: PostLink,
  },
]);

export function parsePostData(postData) {
  const titleEditorState = postData.title
    ? importAsEditorState(postData.title)
    : EditorState.createEmpty();

  // eslint-disable-next-line no-nested-ternary
  const contentEditorState = postData.raw
    ? EditorState.createWithContent(convertFromRaw(postData.raw), decorator)
    : // backward compatibility
      postData.content
      ? importAsEditorState(postData.content, decorator)
      : EditorState.createEmpty();

  const defaultPostMeta = {
    title: postData.title,
    description: postData.excerpt,
  };

  return Object.assign({}, postData, {
    titleEditorState,
    contentEditorState,
    tags: postData.tags ? postData.tags.join(', ') : '',
    meta: postData.customMeta ? postData.meta : defaultPostMeta,
  });
}

export function rawToHtml(rawEditorState) {
  const editorState = EditorState.createWithContent(
    convertFromRaw(rawEditorState),
    decorator,
  );
  return exportAsHtml(editorState);
}

export function exportAsHtml(editorState) {
  const contentState = editorState.getCurrentContent();
  const options = {
    inlineStyles: {
      INLINE_CODE: {
        element: 'code',
        style: STYLE_MAP.INLINE_CODE,
      },
    },
    blockRenderers: {
      atomic: block => renderHtmlAtomic(contentState, block),
      'code-block': block => `<pre>${escapeHtml(block.getText())}</pre>`,
    },
  };
  return stateToHTML(contentState, options);
}

export function exportAsPlainText(editorState) {
  return getCurrentBlock(editorState).getText();
}

export function importAsEditorState(html, decorator) {
  const contentState = stateFromHTML(html);
  const editorState = EditorState.createWithContent(contentState, decorator);
  return editorState;
}

export function createEntityFinderStrategy(entityType) {
  return function entityFinderStrategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(char => {
      const entityKey = char.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === entityType
      );
    }, callback);
  };
}

export function getReduxAwareRef(ref) {
  if (ref && typeof ref.getWrappedInstance === 'function') {
    return ref.getWrappedInstance();
  }

  return ref;
}

function escapeHtml(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
