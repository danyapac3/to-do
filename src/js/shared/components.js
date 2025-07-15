import ContextMenu from '/js/components/context-menu.js';
import TaskModal from '/js/components/task-modal.js';

export const contextMenu = new ContextMenu();
export const taskModal = new TaskModal();

taskModal.element.showModal();