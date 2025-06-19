import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import store from '/js/store/index';
import template from './list.html';

export default class List extends Component {
  constructor (sectionId, parent) {
    super({
      store,
      parent,
      element: htmlToNode(template),
    });
    
    this.sectionId = sectionId;

    this.init();
  }

  render() {
    const borderSection = this.element;
    const ListTitle = borderSection.querySelector('.board-section__title');
    const section = store.state.sections.find(s => s.id === this.sectionId);
    if (section) {
      ListTitle.textContent = section.title;
    }
  }
}