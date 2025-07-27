import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './task-modal.html';
import AddItem from '/js/components/add-item';
import useTasksStore from '/js/stores/tasksStore';
import useListsStore from '/js/stores/listsStore';
import useProjectsStore from '/js/stores/projectsStore';


const tasksStore = useTasksStore();
const listsStore = useListsStore();
const projectsStore = useProjectsStore();


const renderBreadcrumbsItem = (entity, isCurrent) => {
  const $item = htmlToNode(`<div class="breadcrumbs__item">${entity.title}</div>`);
  const modifyerClass = 
    entity.type === 'list' ? 'breadcrumbs__item--list'
    : entity.type === 'project' ? 'breadcrumbs__item--project'
    : isCurrent ? 'breadcrumbs__item--current':
    null ; 
  
  if (modifyerClass) $item.classList.add(modifyerClass);
  return $item;
}


export default class TaskModal extends Component {
  constructor() {
    super({
      element: htmlToNode(template),
    });
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
    $breadcrumbs.innerHTML = '';

    const findEntity = (id, type) => {
      const store = 
        type === 'task' ? tasksStore 
        : type === 'list' ? listsStore
        : type === 'project' ? projectsStore
        : null;

      return store[id];
    };

    (function renderBreadcrumbItem(currentEntity = task) {
      const $breadcrumbsItem = renderBreadcrumbsItem(currentEntity);
      if (currentEntity.type === 'task') {
        $breadcrumbsItem.addEventListener('click', () => {
          this.showWithTask.bind(this, currentEntity.id)
        });
      }
      $breadcrumbs.prepend($breadcrumbsItem);
      
      if (!currentEntity.parentId) return;

      const parentEntity = findEntity(currentEntity.parentId, currentEntity.parentType);

      if (!parentEntity) return;

      renderBreadcrumbItem(parentEntity)
    }).call(this);
  }

  showWithTask(id) {
    this.props.id = id;
    this.render();
    this.element.showModal();
  }
}