import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import store from '/js/store/index';
import template from './board-section.html';

export default class BoardSection extends Component {

  constructor () {
    super({
      store,
      element: htmlToNode(template),
    });
  }

  render() {
    const section = this.element;
  }
}