import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import {taskById, listById, projectById} from '/js/lib/utils/common';
import template from './task-modal.html';
import AddItem from '/js/components/add-item';


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


export default class Sidebar extends Component {
  constructor({store}) {
    super({
      store,
      element: htmlToNode(template),
      subscriptions: ['toggleTaskСompleteness'],
    });
  }

  init() {
    const $modalPlace = document.querySelector('.modal-place');

    const $modal = this.element;
    const $exitButton = $modal.querySelector('.task-modal__exit-button');
    const $taskCheckbox = $modal.querySelector('.task-modal__task-checkbox');

    $taskCheckbox.addEventListener('click', () => {
      if (this.props.id) {
        this.store.dispatch('toggleTaskСompleteness', {id: this.props.id});
      }
    });
    
    $exitButton.addEventListener('click', () => {
      $modal.close()
    });

    $modalPlace.append($modal);
  }

  render({id}) {
    if (!id) return;
    const findById = (id, type) => ({
      task: taskById,
      list: listById,
      project: projectById
    })[type](this.store.state, id);

    const task = this.store.state.tasks.find(t => t.id === id);

    const $modal = this.element;
    const $title = $modal.querySelector('.task-modal__title');
    const $taskCheckbox = $modal.querySelector('.task-modal__task-checkbox');
    const $breadcrumbs = $modal.querySelector('.task-modal__breadcrumbs');
    const $descriptionField = $modal.querySelector('.task-modal__description-field');

    $title.textContent = task.title;
    $taskCheckbox.checked = task.completed;
    $descriptionField.value = task.description;
    $breadcrumbs.innerHTML = '';
    
    let currentEntity = task;
    while (currentEntity) {
      const $breadcrumbsItem = renderBreadcrumbsItem(currentEntity);
      if (currentEntity.type === 'task') {
        $breadcrumbsItem.addEventListener('click', () => {
          this.showWithTask.bind(this, currentEntity.id)
        });
      }
      $breadcrumbs.prepend($breadcrumbsItem);

      
      if (!currentEntity.parentId) break;
      
      currentEntity = findById(currentEntity.parentId, currentEntity.parentType);
    }

  }

  showWithTask(id) {
    this.props.id = id;
    this.render();
    this.element.showModal();
  }
}