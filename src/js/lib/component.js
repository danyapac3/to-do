import Store from '/js/store/store.js';
import PubSub from '/js/lib/pubsub.js';

export default class Component {
  constructor(params) {
    const {
      store,
      element,
      subscriptions = ['stateChange'],
      parent,
      props
    } = params;

    this.props = {};
    this.parent = parent || null;
    this.store = store || ( parent ? parent.store : null ) || null;
    this.events = new PubSub();
    this.element = element;
    this.children = [];
    this.subscriptionTokens = [];
    this.render = this.render ? this.render.bind(this, props || {}) : () => {};
    this.init = this.init ? this.init.bind(this, props || {}) : () => {};
    this.clearUp = this.clearUp ? this.clearUp.bind(this, props || {}) : () => {};
    
    if (parent) parent.addChild(this);

    const subscriptionHandler = () => {
      this.children.forEach(child => child.destroy());
      this.children = [];
      this.render();
    }

    subscriptions.forEach(subscription => {
      const token = this.store.events.subscribe(subscription, subscriptionHandler);
      this.subscriptionTokens.push(token);
    });

    this.init();
    this.render();
  }

  addChild(child) {
    if (!(child instanceof Component)) 
      throw new Error('child must be an instance of "Component"');
    this.children.push(child);
  }

  destroy() {
    this.clearUp();
    this.children.forEach(child => child.destroy());
    this.element.remove();
    if (this.store) {
      this.subscriptionTokens.forEach(token => {
        this.store.events.unsubscribe(token);
      });
    }
  }

  on(type, handler) {
    return this.events.subscribe(type, handler);
  }

  emit(type, data) {
    this.events.publish(type, data);
  }
}