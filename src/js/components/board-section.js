import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import store from '/js/store/index';
import template from './board-section.html';

export default class BoardSection extends Component {
  constructor (sectionId, parent) {
    super({
      store,
      parent,
      element: htmlToNode(template),
    });

    this.sectionId = sectionId;
  }

  render() {
    const borderSection = this.element;
    const boardSectionTitle = borderSection.querySelector('.board-section__title');

    const section = store.state.sections.find(s => s.id === this.sectionId);
    if (section) {
      boardSectionTitle.textContent = section.title;
    }
  }
}