import PubSub from '/js/lib/pubsub.js';

export default class Component {
  constructor(params) {
    const {
      stores = [],
      element,
      parent,
      props,
    } = params;

    this.props = props || {};
    this.parent = parent || null;
    this.stores = stores;
    this.events = new PubSub();
    this.element = element;
    this.children = [];
    this.renderPredicate = this.renderPredicate || (() => true);
    this._render = this.render;
    this.render = this.render 
      ? () => {
        this.children.forEach(child => child.destroy());
        this.children = [];
        this._render(this.props);
      } 
      : () => {};
    this.init = this.init ? this.init.bind(this, this.props || {}) : () => {};
    
    if (parent) parent.addChild(this);

    this.init();
    this.render();

    this.unsubscribeStoreFunctions = stores.map(store => store.$onAction((data) => {
      if (!this.renderPredicate(data)) return;
      this.render();
    }));
  }

  addChild(child) {
    if (!(child instanceof Component)) 
      throw new Error('child must be an instance of "Component"');
    this.children.push(child);
  }

  destroy() {
    this.unsubscribeStoreFunctions.forEach(fn => fn());
    this.children.forEach(child => child.destroy());
    this.element.remove();
  }

  on(type, handler) {
    return this.events.subscribe(type, handler);
  }

  emit(type, data) {
    this.events.publish(type, data);
  }
}