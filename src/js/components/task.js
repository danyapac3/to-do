import removeIcon from '/images/icons/bin.svg';
import renameIcon from '/images/icons/edit.svg';
import detailsIcon from '/images/icons/details.svg';
import moveIcon from '/images/icons/move-to.svg'

import Component from '/js/lib/component';
import template from './task.html';
import { htmlToNode } from '/js/lib/utils/dom';
import useTasksStore from '/js/stores/tasksStore';
import ActionMenu from '/js/components/action-menu';
import DatePicker from '/js/components/date-picker';

import TaskModal from '/js/components/task-modal';
import { formatDate } from '/js/lib/utils/common';

const tasksStore = useTasksStore();
const tasksStoreState = tasksStore.$state;

export default class Task extends Component {
  constructor({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      stores: [tasksStore],
    });
  }

  renderPredicate({name, args, returnValue}) {
    if (name === 'setDueDates' && args[0].includes[this.props.id]) return true;
    
    const id = args[0];
    if (name === 'toggleCompleted' && tasksStoreState[id].parentId === this.props.id) return true;
    return this.props.id === args[0];
  }

  init({id}) {
    const $task = this.element;
    const $checkbox = $task.querySelector('.task__checkbox');
    const $actionButton = $task.querySelector('.task__action-button');

    const openDetails = () => {
      this.emit('openDetails', {id});
      new TaskModal({props: {id, hasBackdrop: true}});
    }

    const renameTask = () => {

    }

    const removeTask = () => { tasksStore.removeTask(id); }

    const moveTask = () => {

    }

    $actionButton.addEventListener('click', (e) => {
      const actionMenu = new ActionMenu({props: {
        x: e.pageX,
        y: e.pageY,
        title: "actions",
        items: [
          {
            title: 'Details',
            iconSrc: detailsIcon,
            callback: openDetails,
          },
          {
            title: 'Rename',
            iconSrc: renameIcon,
            callback: renameTask,
          },
          {
            title: 'Move to',
            iconSrc: moveIcon,
            callback: moveTask,
          },
          {
            title: 'Remove',
            iconSrc: removeIcon,
            callback: removeTask,
          },
        ],
      }});

      e.stopPropagation();
    });

    $checkbox.addEventListener('click', (e) => {
      tasksStore.toggleCompleted(id);
      e.stopPropagation();
    });

    $task.addEventListener('click', openDetails);
  }

  render({id, hiddenDueDate = false}) {
    const task = tasksStore[id];
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');
    const $indicatorBox = $task.querySelector('.task__indicators-box');
    const $descriptionIndicator = $task.querySelector('.task__indicator--description');
    const $subtasksIndicator = $task.querySelector('.task__indicator--subtasks');
    const $subtasksProgress = $subtasksIndicator.querySelector('.task__indicator-info');
    const $dueDateIndicator = $task.querySelector('.task__indicator--due-date');
    const $dueDateInfo = $dueDateIndicator.querySelector('.task__indicator-info');
    const $priorityIndicator = $task.querySelector('.task__indicator--priority');

    const hasDescription = !!task.description;
    const hasSubtasks = !!task.taskIds.length;
    const hasDueDate = !hiddenDueDate && !!task.dueDate;
    const hasPriority = !!task.priority;

    $indicatorBox.hidden = !(hasDescription || hasSubtasks || hasDueDate || hasPriority);
    $descriptionIndicator.hidden = !hasDescription;
    $subtasksIndicator.hidden = !hasSubtasks;
    $dueDateIndicator.hidden = !hasDueDate;
    $priorityIndicator.hidden = !hasPriority;

    const doneNumber = task.taskIds.reduce((acc, subtaskId) => {
      return tasksStore[subtaskId].completed ? acc + 1 : acc;
    }, 0);

    if (hasSubtasks) {
      $subtasksProgress.textContent = `${doneNumber}/${task.taskIds.length}`;
    }
    if (hasDueDate) {
      $dueDateInfo.textContent = formatDate(new Date(task.dueDate));
    }
    if (hasPriority) {
      $priorityIndicator.style.setProperty('--indicator-color', 
        task.priority === 1 ? 'blue' : task.priority === 2 ? 'orange' : 'red'
      );
    }

    $task.dataset.id = id;
    $checkbox.checked = task.completed;
    $title.textContent = task.title;
  }
}