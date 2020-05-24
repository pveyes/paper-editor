import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { EditorBlock } from 'draft-js';
import cx from 'classnames';
import { selectEmbedWithEntity } from '../../../actions/EditorEmbedAction';
import './EmbedWithCaption.css';

class EmbedWithCaption extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    entity: PropTypes.object,
    block: PropTypes.object,
    activeEntity: PropTypes.object,
  };

  handleClick = () => {
    this.props.dispatch(
      selectEmbedWithEntity(this.props.entity, this.props.block),
    );
  };

  render() {
    const { children, ...props } = this.props;
    const embedWrapperClass = cx({
      'EmbedWithCaption-wrapper': true,
      active: this.props.activeEntity === this.props.entity,
    });

    return (
      <div onClick={this.handleClick}>
        <div className={embedWrapperClass}>
          {children}
          <div className={'EmbedWithCaption-overlay'} />
        </div>
        <figcaption className={'EmbedWithCaption-caption'}>
          <EditorBlock {...props} />
        </figcaption>
      </div>
    );
  }
}

export default connect(state => state.embed)(EmbedWithCaption);
