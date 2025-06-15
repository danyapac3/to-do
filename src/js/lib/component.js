import Store from '/js/store/store.js';

export default class Component {
  constructor(params) {

    this.render = this.render || function() {};

    if (params.store instanceof Store) {
      params.store.events.publish('stateChange', () => this.render());
    }

    if (params.element) {
      this.element = params.element;
    }
  }
}