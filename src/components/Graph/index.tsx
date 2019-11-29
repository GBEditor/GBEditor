import React from 'react';
import pick from 'lodash/pick';

import {
  GraphCommonEvent,
  GraphNodeEvent,
  GraphEdgeEvent,
  GraphCanvasEvent,
  GraphCustomEvent,
} from '../../common/constants';
import {
  FlowData,
  MindData,
  GraphNativeEvent,
  GraphReactEvent,
  GraphReactEventProps,
} from '../../common/interfaces';
import { EditorPrivateContextProps, withEditorPrivateContext } from '../EditorContext';

import '../../shape';
import '../../command';
import '../../behavior';

const FIT_VIEW_PADDING = 200;

interface GraphProps extends Partial<GraphReactEventProps>, EditorPrivateContextProps {
  style?: React.CSSProperties;
  className?: string;
  containerId: string;
  data: FlowData | MindData;
  parseData(data: object): void;
  initGraph(width: number, height: number): G6.Graph;
}

interface GraphState {}

class Graph extends React.Component<GraphProps, GraphState> {
  graph: G6.Graph | null = null;

  componentDidMount() {
    this.initGraph();
    this.bindEvent();
  }

  componentDidUpdate(prevProps: GraphProps) {
    const { data } = this.props;

    if (data !== prevProps.data) {
      this.changeData(data);
    }
  }

  initGraph() {
    const { containerId, parseData, initGraph, setGraph } = this.props;
    const { clientWidth = 0, clientHeight = 0 } = document.getElementById(containerId) || {};

    // 解析数据
    const data = { ...this.props.data };

    parseData(data);

    // 初始画布
    this.graph = initGraph(clientWidth, clientHeight);

    this.graph.read(data);
    this.graph.fitView(FIT_VIEW_PADDING);
    this.graph.setMode('default');

    setGraph(this.graph);
  }

  bindEvent() {
    const { graph, props } = this;

    if (!graph) {
      return;
    }

    const events: {
      [propName in GraphReactEvent]: GraphNativeEvent;
    } = {
      ...GraphCommonEvent,
      ...GraphNodeEvent,
      ...GraphEdgeEvent,
      ...GraphCanvasEvent,
      ...GraphCustomEvent,
    };

    (Object.keys(events) as GraphReactEvent[]).forEach(event => {
      if (typeof props[event] === 'function') {
        graph.on(events[event], props[event] as (e: GraphReactEvent) => void);
      }
    });
  }

  changeData(data: any) {
    const { graph } = this;
    const { parseData } = this.props;

    if (!graph) {
      return;
    }

    parseData(data);

    graph.changeData(data);
    graph.fitView(FIT_VIEW_PADDING);
  }

  render() {
    const { containerId, children } = this.props;

    return (
      <div id={containerId} {...pick(this.props, ['className', 'style'])}>
        {children}
      </div>
    );
  }
}

export default withEditorPrivateContext(Graph);
