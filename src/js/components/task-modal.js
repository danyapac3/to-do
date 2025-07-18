import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './task-modal.html';
import store from '/js/store/index';

// .task-modal
// .task-modal__exit-button
// .task-modal__header
// .task-modal__title
// .task-modal__task-checkbox
// .task-modal__body
// .task-modal__main
// .task-modal__info
// .task-modal__info-section
// .task-modal__list-link
// .task-modal__project-link
// .task-modal__description
// .task-modal__description-header
// .task-modal__description-title
// .task-modal__description-icon
// .task-modal__description-edit-button
// .task-modal__description-field-wrapper
// .task-modal__description-field
// .task-modal__checklist
// .task-modal__checklist-header
// .task-modal__checklist-title
// .task-modal__subtask-icon
// .task-modal__checklist-percentage
// .task-modal__checklist-body
// .task-modal__checklist-tasks
// .task-modal__sidebar

export default class Sidebar extends Component {
  constructor({store}) {
    super({
      store,
      element: htmlToNode(template),
      subscriptions: [],
    });
  }

  init() {
    const $modalPlace = document.querySelector('.modal-place');

    const $modal = this.element;
    const $exitButton = $modal.querySelector('.task-modal__exit-button');
    
    $exitButton.addEventListener('click', () => {
      $modal.close()
    });

    $modalPlace.append($modal);
  }

  render() {

  }

  showWithTask(id) {
    const task = this.store.state.tasks.find(t => t.id === id);
    const $modal = this.element;
    const $title = $modal.querySelector('.task-modal__title');
  
    $title.textContent = task.title;
    

    const {
      projectId,
      listId,
    } = task;

    this.element.showModal();
  }
}