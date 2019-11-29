import React from 'react';
import pick from 'lodash/pick';
// eslint-disable-next-line import/no-unresolved
import { G } from '@antv/g6/types/g';
import { ADD_NODE_MODEL, ADD_NODE_DELEGATE_SHAPE, GraphMode } from '../../common/constants';
import { EditorContextProps, withEditorContext } from '../EditorContext';
import Item from './Item';

interface ItemPanelProps extends EditorContextProps {
  graph: G6.Graph;
  style?: React.CSSProperties;
  className?: string;
}

interface ItemPanelState {}

class ItemPanel extends React.Component<ItemPanelProps, ItemPanelState> {
  // eslint-disable-next-line react/sort-comp
  static Item = Item;

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp, false);
  }

  handleMouseUp = () => {
    const { graph } = this.props;

    if (graph.getCurrentMode() === GraphMode.Default) {
      return;
    }

    const group: G.Group = graph.get('group');
    const shape: G.Shape = group.findByClassName(ADD_NODE_DELEGATE_SHAPE) as G.Shape;

    if (shape) {
      shape.remove(true);
      graph.paint();
    }

    graph.set(ADD_NODE_MODEL, null);
    graph.setMode(GraphMode.Default);
  };

  render() {
    const { children } = this.props;

    return <div {...pick(this.props, ['style', 'className'])}>{children}</div>;
  }
}

export { Item };

export default withEditorContext<ItemPanelProps>(ItemPanel);
