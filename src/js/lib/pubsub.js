export default class PubSub {
  constructor() {
    this.events = {};
  }

  subscripe(event, callback) {
    if (!this.events.hasOwnProperty(event)) {
      this.events[event] = [];
    }

    return this.events[event].push(callback);
  }

  publish(event, data) {
    if (!this.events.hasOwnProperty(event)) {
      return [];
    }

    return this.events[event].map(() => callback(data));
  }
} 