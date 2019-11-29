import { Behavior, GraphEvent } from '../common/interfaces';
import behaviorManager from '../common/behaviorManager';
import { ItemState } from '../common/constants';

interface ActiveEdgeBehavior extends Behavior {
  shouldBegin(e: GraphEvent): boolean;
  setAllItemStates(e: GraphEvent): void;
  clearAllItemStates(e: GraphEvent): void;
}

const activeEdgeBehavior: ActiveEdgeBehavior = {
  getEvents() {
    return {
      'edge:mouseenter': 'setAllItemStates',
      'edge:mouseleave': 'clearAllItemStates',
    };
  },

  shouldBegin(e: GraphEvent) {
    // 拖拽过程中没有目标节点，只有 x, y 坐标，不点亮
    const edge = e.item as G6.Edge;
    if (edge.getTarget().x) return false;
    return true;
  },

  setAllItemStates(e: GraphEvent) {
    if (!this.shouldBegin(e)) return;
    // 1.激活当前选中的边
    const { graph } = this;
    const edge = e.item as G6.Edge;
    if (graph) {
      graph.setItemState(edge, ItemState.Active, true);

      // 2. 激活边关联的 sourceNode 与 targetNode
      graph.setItemState(edge.getTarget(), ItemState.Active, true);
      graph.setItemState(edge.getSource(), ItemState.Active, true);
    }
  },

  clearAllItemStates(e: GraphEvent) {
    if (!this.shouldBegin(e)) return;
    // 状态还原
    const { graph } = this;
    const edge = e.item as G6.Edge;
    if (graph) {
      graph.setItemState(edge, ItemState.Active, false);
      graph.setItemState(edge.getTarget(), ItemState.Active, false);
      graph.setItemState(edge.getSource(), ItemState.Active, false);
    }
  },
};

behaviorManager.register('active-edge', activeEdgeBehavior);
