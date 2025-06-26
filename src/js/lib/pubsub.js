import {v4 as uuidv4} from 'uuid';

export default class PubSub {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    if (!this.events.hasOwnProperty(event)) {
      this.events[event] = [];
    }

    const subscription = {token: 's-token-' + uuidv4(), callback}
    this.events[event].push(subscription);
    return subscription.token;
  }

  publish(event, data) {
    if (!this.events.hasOwnProperty(event)) {
      return [];
    }

    this.events[event].forEach(({callback}) => callback(data));
  }

  unsubscribe(token) {
    for (let key in this.events) {
      const event = this.events[key];
      this.events[key] = event.filter(subscription => !(subscription.token === token));
    }
  }
}