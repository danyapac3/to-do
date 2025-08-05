import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './today-board.html';
import List from './list';
import AddItem from './add-item';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import useProjectsStore from "/js/stores/projectsStore";
import useListsStore from "/js/stores/listsStore";

export default class Board extends Component {

  constructor ({parent, props}) {
    super({
      element: htmlToNode(template),
      parent,
      props,
      stores: [],
    });

    this.currentId = null;
  }

  renderPredicate({name}) {
    return true;
  }

  init() {
    const projectsStore = useProjectsStore();
    const $board = this.element;
    const $content = $board.querySelector('.board__content');
  }

  render() {
    const $board = this.element;
    const $title = $board.querySelector('.board__title');
    const $content = $board.querySelector('.board__content');
    const $addNewSectionFormPlace = $board.querySelector('.board__add-new-section-form-place');

    const projectsStore = useProjectsStore();

  }
}