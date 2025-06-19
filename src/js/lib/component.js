import Store from '/js/store/store.js';

export default class Component {
  #subscriptionTokens = [];
  #subscriptions;

  constructor(params) {
    const {
      store,
      element,
      subscriptions = ['stateChange'],
      parent = null,
    } = params;

    this.render = this.render || function() {};
    this.children = [];
    this.parent = parent;
    this.#subscriptions = subscriptions;
    if (element) { this.element = element; }
    if (store) { this.store = store; }

    if (parent && !(parent instanceof Component)) {
      throw new Error('"parent" parameter must an instance of "Component"');
    }
    if (parent) {
      parent.addChild(this);
    }
  }

  init() {
    const subscriptionHandler = () => {
      this.children.forEach(child => child.destroy());
      this.render();
    }

    if (this.store instanceof Store) {
      this.#subscriptions.forEach(subscription => {
        this.#subscriptionTokens.push(
          this.store.events.subscribe(subscription, subscriptionHandler)
        );
      });
    }

    this.render();
  }

  addChild(child) {
    if (child instanceof Component) {
      this.children.push(child);
    } else {
      throw new Error('child must be an instance of "Component"');
    }
  }

  destroy() {
    this.children.forEach(child => child.destroy());
    if (this.element) {
      this.element.remove();
    }
    if (this.store) {
      this.#subscriptionTokens.forEach(token => {
        this.store.events.unsubscribe(token);
      });
    }
    if (this.parent) {
      this.parent.children = this.parent.children.splice(this.parent.children.indexOf(this), 1);
    }
  }
}