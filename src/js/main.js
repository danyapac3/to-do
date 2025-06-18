// import styles
import "/styles/index.scss";

// import store
import store from '/js/store/index'

// import components
import Sidebar from '/js/components/sidebar';
import Board from '/js/components/board';

const page = document.querySelector('.page');
const sidebar = new Sidebar();
const board = new Board();


page.appendChild(sidebar.element);
page.appendChild(board.element);