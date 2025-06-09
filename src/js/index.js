import "@styles/index.scss";

const toggleSidebarButton = document.querySelector('.sidebar__toggle-visibility-button');
const sidebar = document.querySelector('.sidebar');

toggleSidebarButton.addEventListener('click', (e) => {
  sidebar.classList.toggle('hidden');
});