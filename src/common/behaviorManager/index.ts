import G6 from '@antv/g6';
import { Behavior } from '../interfaces';

class BehaviorManager {
  behaviors: {
    [propName: string]: Behavior;
  };

  constructor() {
    this.behaviors = {};
  }

  getRegisteredBehaviors() {
    const registeredBehaviors: { [x: string]: { [x: string]: string } } = {};

    Object.keys(this.behaviors).forEach(name => {
      const behavior = this.behaviors[name];
      const { graphMode = 'default' } = behavior;

      if (registeredBehaviors && !registeredBehaviors[graphMode]) {
        registeredBehaviors[graphMode] = {};
      }

      registeredBehaviors[graphMode][name] = name;
    });
    return registeredBehaviors;
  }

  register(name: string, behavior: Behavior) {
    this.behaviors[name] = behavior;
    G6.registerBehavior(name, behavior);
  }
}

export default new BehaviorManager();
