import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './task-modal.html';
import AddItem from '/js/components/add-item';
import Task from '/js/components/task';
import useTasksStore from '/js/stores/tasksStore';
import useListsStore from '/js/stores/listsStore';
import useProjectsStore from '/js/stores/projectsStore';


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


export default class TaskModal extends Component {
  constructor() {
    super({
      element: htmlToNode(template),
      stores: [useTasksStore()],
    });
  }

  renderPredicate() {
    if (!this.props.id) return false
    return true;
  }

  init() {
    const $modalPlace = document.querySelector('.modal-place');

    const $modal = this.element;
    const $exitButton = $modal.querySelector('.task-modal__exit-button');
    const $taskCheckbox = $modal.querySelector('.task-modal__task-checkbox');

    $taskCheckbox.addEventListener('click', () => {
      if (this.props.id) {
        tasksStore.toggleCompleted(this.props.id);
      }
    });
    
    $exitButton.addEventListener('click', () => {
      $modal.close()
      this.props.id = null;
    });

    $modalPlace.append($modal);
  }

  render({id}) {
    if (!id) return;
    
    const task = tasksStore[id];

    const $modal = this.element;
    const $title = $modal.querySelector('.task-modal__title');
    const $taskCheckbox = $modal.querySelector('.task-modal__task-checkbox');
    const $breadcrumbs = $modal.querySelector('.task-modal__breadcrumbs');
    const $descriptionField = $modal.querySelector('.task-modal__description-field');

    $title.textContent = task.title;
    $taskCheckbox.checked = task.completed;
    $descriptionField.value = task.description;
    $descriptionField.addEventListener('change', (e) => {
      tasksStore.setDescription(id, $descriptionField.value.trim());
    });

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
          this.showWithTask.call(this, currentEntity.id)
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
      $checklistTasks.appendChild(subtask.element);
    });

    const addSubtaskForm = new AddItem({parent: this, props: {title: 'Add new task'}});
    $checklistBody.appendChild(addSubtaskForm.element);
    addSubtaskForm.on('save', ({text: title}) => {
      tasksStore.addSubtask(task.id, title);
    });
  }

  showWithTask(id) {
    this.props.id = id;
    this.render();
    this.element.showModal();
  }
}