import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './task-modal.html';
import AddItem from '/js/components/add-item';
import Task from '/js/components/task';
import DueDateSelector from '/js/components/due-date-selector';
import PrioritySelector from '/js/components/priority-selector';
import useTasksStore from '/js/stores/tasksStore';
import useListsStore from '/js/stores/listsStore';
import useProjectsStore from '/js/stores/projectsStore';
import {extendDialog} from '/js/components/dialog';

import Sortable from 'sortablejs/modular/sortable.core.esm.js';

const tasksStore = useTasksStore();
const listsStore = useListsStore();
const projectsStore = useProjectsStore();


const renderBreadcrumbsItem = (entity) => {
  const $item = htmlToNode(`<div class="breadcrumbs__item"><div class="breadcrumbs__item-text">${entity.title}</div></div>`);
  const modifyerClass = 
    entity.type === 'list' ? 'breadcrumbs__item--list'
    : entity.type === 'project' ? 'breadcrumbs__item--project'
    : null ; 
  
  if (modifyerClass) $item.classList.add(modifyerClass);
  return $item;
}


class TaskModal extends Component {
  constructor({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      stores: [useTasksStore()],
    });
  }

  renderPredicate({name, args, returnValue}) {
    if (!this.props.id) return false;
    if (name === "toggleCompleted") return false;
    if (name === "setPriority") return false;
    if (name === "setDueDate") return false;
    if (name === "clearDueDate") return false; 
    return true;
  }

  init() {
    const $modalPlace = document.querySelector('.modal-place');
    const $modal = this.element;
    const $body = $modal.querySelector('.task-modal__body');
    const $exitButton = $modal.querySelector('.task-modal__exit-button');
    const $taskCheckbox = $modal.querySelector('.task-modal__task-checkbox');
    const $checklistTasks = $modal.querySelector('.task-modal__checklist-tasks');
    const $descriptionField = $modal.querySelector('.task-modal__description-field');

    let previousKnownScrollPosition = 0;
    let isWaitingForFrame = false;

    $body.addEventListener('scroll', (e) => {
      previousKnownScrollPosition = $body.scrollTop;
      if (!isWaitingForFrame) {
        window.requestAnimationFrame(() => {
          $body.classList.toggle('task-modal__body--scrolled', previousKnownScrollPosition > 0);
          isWaitingForFrame = false;
        });

        isWaitingForFrame = true;
      }
    });

    $descriptionField.addEventListener('change', (e) => {
      tasksStore.setDescription(this.props.id, $descriptionField.value.trim());
    });

    $taskCheckbox.addEventListener('click', () => {
      if (this.props.id) {
        tasksStore.toggleCompleted(this.props.id);
      }
    });

    $exitButton.addEventListener('click', () => {
      console.log(this.parent);
      this.parent.close();
    });

    this.sortable = new Sortable($checklistTasks, {
      animation: 0,
      delay: 150,
      delayOnTouchOnly: true,
      ghostClass: 'ghost',
      chosenClass: 'chosen',
      dragClass: 'in-drag',

      onEnd: ({ oldIndex, newIndex }) => {
        tasksStore.moveSubtask(this.props.id, oldIndex, newIndex);
      }
    });

    $modalPlace.appendChild($modal);
  }

  render({id}) {
    if (!id) return;

    const $modal = this.element;
    const $title = $modal.querySelector('.task-modal__title');
    const $taskCheckbox = $modal.querySelector('.task-modal__task-checkbox');
    const $breadcrumbs = $modal.querySelector('.task-modal__breadcrumbs');
    const $descriptionField = $modal.querySelector('.task-modal__description-field');
    const $miniSelectorsPlace = $modal.querySelector('.task-modal__mini-selectors');

    const task = tasksStore[id];

    const dueDateSelector = new DueDateSelector({parent: this, props: {id}});
    const prioritySelector = new PrioritySelector({parent: this, props: {id}});
    $miniSelectorsPlace.appendChild(dueDateSelector.element);
    $miniSelectorsPlace.appendChild(prioritySelector.element);

    $descriptionField.value = task.description;

    $title.textContent = task.title;
    $taskCheckbox.checked = task.completed;

    $breadcrumbs.innerHTML = '';

    const findEntity = (id, type) => {
      const store = 
        type === 'task' ? tasksStore 
        : type === 'list' ? listsStore
        : type === 'project' ? projectsStore
        : null;

      return store[id];
    };

    (function renderBreadcrumbItem(currentEntity = task, depth = 1) {
      if (depth > 3) return;
      const $breadcrumbsItem = renderBreadcrumbsItem(currentEntity);
      if (currentEntity.type === 'task') {
        $breadcrumbsItem.addEventListener('click', () => {
          this.props.id = currentEntity.id;
          this.render();
        });
      }
      $breadcrumbs.prepend($breadcrumbsItem);
      
      if (!currentEntity.parentId) return;

      const parentEntity = findEntity(currentEntity.parentId, currentEntity.parentType);

      if (!parentEntity) return;

      renderBreadcrumbItem.call(this, parentEntity, depth + 1);
    }).call(this);


    const $checklist = $modal.querySelector('.task-modal__checklist');
    const $checklistTasks = $checklist.querySelector('.task-modal__checklist-tasks');
    const $checklistBody = $checklist.querySelector('.task-modal__checklist-body');

    task.subtaskIds.forEach((taskId) => {
      const subtask = new Task({parent: this, props: {id: taskId}});
      subtask.on('openDetails', ({id}) => {
        this.parent.close();
      });
      $checklistTasks.appendChild(subtask.element);
    });

    const addSubtaskForm = new AddItem({parent: this, props: {title: 'Add new task'}});
    $checklistBody.appendChild(addSubtaskForm.element);
    addSubtaskForm.on('save', ({text: title}) => {
      tasksStore.addSubtask(task.id, title);
    });
  }

  cleanUp() {
    this.sortable.destroy();
  }
}

export default extendDialog(TaskModal);