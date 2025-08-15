import Component from '/js/lib/component';
import template from './today-board.html';
import {htmlToNode} from '/js/lib/utils/dom';
import DatePicker from '/js/components/date-picker';

export default class TodayBoard extends Component {

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
    const $board = this.element;
    const $content = $board.querySelector('.board__content');
  }

  render() {
    const $board = this.element;
    const $title = $board.querySelector('.board__title');
    const $content = $board.querySelector('.board__content');
    const $addNewSectionFormPlace = $board.querySelector('.board__add-new-section-form-place');

    // debug 
    const $firstActionButton = $board.querySelector('.list__show-actions-button');
    $firstActionButton.addEventListener('click', ({pageX, pageY}) => {
      const datepicker = new DatePicker({props: {x: pageX, y: pageY}});
    });
  }
}