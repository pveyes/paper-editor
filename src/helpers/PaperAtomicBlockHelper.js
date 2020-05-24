/* eslint max-len: 0 */
import { AtomicBlockUtils } from 'draft-js';
import { removeCurrentBlock, createEntity } from './DraftEditorHelper';
import { ENTITY_TYPES } from '../constants/PaperEditorConstant';
import { STYLE_OVERRIDE } from '../components/shared/renderer/IframeEmbed';
import jsonp from '../api/jsonp';

export function renderHtmlAtomic(contentState, block) {
  const entityKey = block.getEntityAt(0);
  function wrapWithCaption(embed) {
    return `<figure class="embed">${embed}<figcaption>${block.getText()}</figcaption></figure>`;
  }

  if (entityKey) {
    const entity = contentState.getEntity(entityKey);
    const data = entity.getData();

    switch (entity.getType()) {
      case ENTITY_TYPES.DIVIDER:
        return '<hr />';
      case ENTITY_TYPES.GITHUB_GIST:
        return wrapWithCaption(
          `<iframe srcdoc="${STYLE_OVERRIDE}<script type='text/javascript' src='${data.url}.js'></script>"></iframe>`,
        );
      case ENTITY_TYPES.VIDEO_EMBED:
        return wrapWithCaption(
          `<div class="video-wrapper"><iframe src="${data.url}" frameborder="0" allowfullscreen></iframe></div>`,
        );
      case ENTITY_TYPES.HTML_EMBED:
        return wrapWithCaption(
          `<iframe srcdoc='${STYLE_OVERRIDE}${data.html}'></iframe>`,
        );
      case ENTITY_TYPES.IMAGE:
        return wrapWithCaption(`<img src=${data.url} />`);
      default:
    }
  }
}

/**
 * Because of how AtomicBlockUtils works, when inserting an atomic block,
 * it will leave the previous block as is, even though it's empty. This will
 * create an empty block above the atomic block itself and is undesired behavior.
 *
 * When creating atomic block via newline (inline url), we also want them to be
 * removed, same as the previous case. That's why, before inserting atomic
 * block, we need remove the current block first.
 */
function insertAtomicBlock(editorState, entityKey, char = ' ') {
  const newEditorState = removeCurrentBlock(editorState);
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, char);
}

export function insertNewPartToEditorState(editorState) {
  const entityKey = createEntity(
    editorState,
    ENTITY_TYPES.DIVIDER,
    'IMMUTABLE',
  );
  return insertAtomicBlock(editorState, entityKey);
}

/**
 * @return { valid: boolean, editorState?: Promise<EditorState>|EditorState }
 */
export function insertEmbedFromInlineUrl(editorState, url) {
  if (url.indexOf('youtube.com') !== -1) {
    const videoId = url.replace(/.*?v=([^\s\n&]+).*/, '$1');
    const embedData = { url: `https://www.youtube.com/embed/${videoId}` };
    const entityKey = createEntity(
      editorState,
      ENTITY_TYPES.VIDEO_EMBED,
      'IMMUTABLE',
      embedData,
    );
    return {
      valid: true,
      editorState: insertAtomicBlock(editorState, entityKey),
    };
  }

  if (url.indexOf('gist.github') !== -1) {
    const embedData = { url: url.replace(/#.*/, '') };
    const entityKey = createEntity(
      editorState,
      ENTITY_TYPES.GITHUB_GIST,
      'IMMUTABLE',
      embedData,
    );
    return {
      valid: true,
      editorState: insertAtomicBlock(editorState, entityKey),
    };
  }

  /**
   * To embed tweet, we need to call JSONP API endpoint for html content
   */
  if (url.indexOf('twitter') !== -1) {
    const tweetId = url.replace(/.*status\/(\d+).*/, '$1');
    const query = {
      callback: '$callbackFn',
      hide_media: false,
      hide_thread: false,
      id: tweetId,
      lang: 'en',
      _: new Date().getTime(),
    };

    const newEditorState = jsonp(
      'https://api.twitter.com/1/statuses/oembed.json',
      query,
    ).then(data => {
      const { html } = data;
      const embedData = { html: `<center>${html}</center>` };
      const entityKey = createEntity(
        editorState,
        ENTITY_TYPES.HTML_EMBED,
        'IMMUTABLE',
        embedData,
      );
      return insertAtomicBlock(editorState, entityKey);
    });

    return { valid: true, editorState: newEditorState };
  }

  if (url.match(/\.(jpe?g|png|gif)$/)) {
    return {
      valid: true,
      editorState: insertExternalImageFromInlineUrl(editorState, url),
    };
  }

  return { valid: false };
}

function insertExternalImageFromInlineUrl(editorState, url) {
  const imageData = { url };
  const entityKey = createEntity(
    editorState,
    ENTITY_TYPES.IMAGE,
    'IMMUTABLE',
    imageData,
  );
  return insertAtomicBlock(editorState, entityKey);
}
