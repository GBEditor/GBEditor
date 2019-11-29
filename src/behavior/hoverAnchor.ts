import { Behavior, GraphEvent } from '../common/interfaces';
import behaviorManager from '../common/behaviorManager';

interface HoverAnchorBehavior extends Behavior {
  shouldBegin(e: GraphEvent): boolean;
  onEnterAnchor(e: GraphEvent): void;
  onLeaveAnchor(e: GraphEvent): void;
}

const hoverAnchor: HoverAnchorBehavior = {
  getEvents() {
    return {
      mouseenter: 'onEnterAnchor',
      mousemove: 'onEnterAnchor',
      mouseleave: 'onLeaveAnchor',
    };
  },
  shouldBegin(ev) {
    const { target } = ev;
    const targetName = target.get('className');
    // 如果点击的不是锚点就结束
    if (targetName === 'anchor') return true;
    return false;
  },
  onEnterAnchor(e) {
    if (!this.shouldBegin(e)) return;
    const { graph } = this;
    const node = e.item;
    const { target } = e;
    if (graph) {
      graph.setItemState(node, `activeAnchor${target.get('index')}`, true);
    }
  },
  onLeaveAnchor(e) {
    if (!this.shouldBegin(e)) return;
    const { graph } = this;
    const node = e.item;
    const { target } = e;
    if (graph) {
      graph.setItemState(node, `activeAnchor${target.get('index')}`, false);
    }
  },
};

behaviorManager.register('hover-anchor', hoverAnchor);
