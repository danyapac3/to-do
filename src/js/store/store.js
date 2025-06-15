import PubSub from '/js/lib/pubsub.js';

export default class Store {
  constructor (params) {
    const self = this;

    self.state = {};
    self.mutations = {};
    self.actions = {};

    self.status = 'resting';

    self.events = new PubSub();

    if (params.hasOwnProperty('mutations')) {
      self.mutations = params.mutations;
    }

    if (params.hasOwnProperty('actions')) {
      self.actions = params.actions;
    }

    self.state = new Proxy((params.state || {}), {
      set(state, key, value) {
        state[key] = value;

        self.events.publish('stateChange');

        if (self.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`);
        };

        self.status = 'restring';

        return true;
      }
    })
  }

  dispatch(actionKey, payload) {
    if(typeof this.actions[actionKey] === !'function') {
      console.error(`Action "${actionKey} doesn't exist.`);
      return false;
    }

    this.status = 'action';

    this.actions[actionKey](this, payload);

    return true;
  }

  commit(mutationKey, payload) {
    if (typeof this.mutations[mutationKey] !== 'function') {
       console.error(`Mutation "${mutationKey} doesn't exist.`);
       return false;
    }

    this.status = 'mutation';

    let newState = this.mutations[mutationKey](this.state, payload);

    this.state = Object.assign(this.state, newState);

    return true;
  }
}