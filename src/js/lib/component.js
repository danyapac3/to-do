export default class Component {
  constructor({store, element}) {

    this.render = this.render || function() {};

    if (element) {
      this.element = element;
    }
  }
}