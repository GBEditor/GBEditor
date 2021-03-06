import React from 'react';
import pick from 'lodash/pick';
import { getSelectedNodes, getSelectedEdges } from '../../utils';
import { GraphState, EditorEvent } from '../../common/constants';
import { EditorContextProps, withEditorContext } from '../EditorContext';
import { GraphStateEvent } from '../../common/interfaces';

interface DetailPanelProps extends EditorContextProps {
  graph: G6.Graph;
  style?: React.CSSProperties;
  className?: string;
}

interface DetailPanelState {
  graphState: GraphState;
}

class DetailPanel extends React.Component<DetailPanelProps, DetailPanelState> {
  static create = (type: GraphState) => {
    class TypedPanel extends DetailPanel {
      constructor(props: DetailPanelProps) {
        super(props, type);
      }
    }

    return withEditorContext<DetailPanelProps>(TypedPanel);
  };

  type: GraphState;

  state = {
    graphState: GraphState.CanvasSelected,
  };

  constructor(props: DetailPanelProps, type: GraphState) {
    super(props);

    this.type = type;
  }

  componentDidMount() {
    const { graph } = this.props;

    graph.on<GraphStateEvent>(EditorEvent.onGraphStateChange, ({ graphState }) => {
      this.setState({
        graphState,
      });
    });
  }

  render() {
    const { graph, children } = this.props;
    const { graphState } = this.state;

    if (!graph) {
      return null;
    }

    if (graphState !== this.type) {
      return null;
    }

    return (
      <div {...pick(this.props, ['style', 'className'])}>
        {React.Children.toArray(children).map(child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              nodes: getSelectedNodes(graph),
              edges: getSelectedEdges(graph),
            });
          }
          return child;
        })}
      </div>
    );
  }
}

export const NodePanel = DetailPanel.create(GraphState.NodeSelected);
export const EdgePanel = DetailPanel.create(GraphState.EdgeSelected);
export const MultiPanel = DetailPanel.create(GraphState.MultiSelected);
export const CanvasPanel = DetailPanel.create(GraphState.CanvasSelected);
