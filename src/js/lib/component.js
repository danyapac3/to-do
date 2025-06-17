import Store from '/js/store/store.js';

export default class Component {
  constructor(params) {

    const {
      store,
      element,
      subscriptions = ['stateChange']
    } = params;

    this.render = this.render || function() {};

    if (store instanceof Store) {
      subscriptions.forEach(subscription => {
        store.events.subscribe(subscription, () => this.render());
      });
    }

    if (element) {
      this.element = element;
    }
  }
}