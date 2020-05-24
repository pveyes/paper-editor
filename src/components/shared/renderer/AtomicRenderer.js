import React from 'react';
import PropTypes from 'prop-types';
import { ENTITY_TYPES } from '../../../constants/PaperEditorConstant';

// renderer
import EmbedWithCaption from './EmbedWithCaption';
import PostImage from './PostImage';
import GithubGist from './GithubGist';
import VideoEmbed from './VideoEmbed';
import IframeEmbed from './IframeEmbed';
import PostEmbed from './PostEmbed';
import PostDivider from './PostDivider';

const AtomicRenderer = props => {
  const { contentState, block } = props;
  const entityKey = block.getEntityAt(0);

  if (!entityKey) {
    return null;
  }

  const entity = contentState.getEntity(entityKey);
  const data = entity.getData();

  switch (entity.getType()) {
    case ENTITY_TYPES.IMAGE:
      return (
        <EmbedWithCaption entity={entity} {...props}>
          <PostImage src={data.url} />
        </EmbedWithCaption>
      );
    case ENTITY_TYPES.GITHUB_GIST:
      return (
        <EmbedWithCaption entity={entity} {...props}>
          <GithubGist url={data.url} />
        </EmbedWithCaption>
      );
    case ENTITY_TYPES.VIDEO_EMBED:
      return (
        <EmbedWithCaption entity={entity} {...props}>
          <VideoEmbed url={data.url} />
        </EmbedWithCaption>
      );
    case ENTITY_TYPES.EMBED:
      return (
        <EmbedWithCaption entity={entity} {...props}>
          <PostEmbed url={data.url} />
        </EmbedWithCaption>
      );
    case ENTITY_TYPES.HTML_EMBED:
      return (
        <EmbedWithCaption entity={entity} {...props}>
          <IframeEmbed>
            {data.html}
          </IframeEmbed>
        </EmbedWithCaption>
      );
    case ENTITY_TYPES.DIVIDER:
      return <PostDivider />;
    default:
      return (
        <div>
          {'Not supported yet'}
        </div>
      );
  }
};

AtomicRenderer.propTypes = {
  block: PropTypes.object,
  contentState: PropTypes.object,
};

export default AtomicRenderer;
