const clamp = (min, max, value) => Math.min(Math.max(min, value), max);

const dragStartEvent = new Event('dndDragStart');
const dragEndEvent = new Event('dndDragEnd');
const dropEvent = new Event('dndDrop');

const mouseDownHandler = (e) => {
  if (e.button !== 0) return;

  const draggable = (e.target.closest('.draggable'));
  if (!draggable) return;

  const innerShiftX = e.pageX - draggable.getBoundingClientRect().left;
  const innerShiftY = e.pageY - draggable.getBoundingClientRect().top;

  const setDragStyles = (e) => {
    draggable.style.position = 'absolute';
    draggable.style.zIndex = 1000;
    draggable.style.left = 0;
    draggable.style.top = 0;
    document.body.appendChild(draggable);
  }

  const moveTo = (pageX, pageY) => {
    const supposedX = pageX - innerShiftX;
    const supposedY = pageY - innerShiftY;

    const x = supposedX;
    const y = supposedY;

    draggable.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  let scrollTimeoutIndex = null;

  const scrollWithPointer = (pageX, pageY, elm) => {
    if (!elm) return;

    const {overflowX, overflowY} = getComputedStyle(elm);
    if (!['auto', 'scroll'].includes(overflowX) && !['auto', 'scroll'].includes(overflowY)) {
      scrollWithPointer(pageX, pageY, elm.parentElement);
      return;
    }

    const scrollEdgeSize = 60; // pixels
    const scrollSpeed = 4;
    const {top, left} = elm.getBoundingClientRect();
    const height = elm.offsetHeight;
    const width = elm.offsetWidth;
    const distanceTop = Math.max(0, pageY - top);
    const distanceLeft = Math.max(0, pageX - left);
    const distanceBottom = Math.max(0, top + height - pageY);
    const distanceRight = Math.max(0, left + width - pageX);
    const hasScrollTop = elm.scrollTop > 0;
    const hasScrollLeft = elm.scrollLeft > 0;
    const hasScrollBottom = elm.scrollHeight - elm.scrollTop > elm.clientHeight;
    const hasScrollRight = elm.scrollWidth - elm.scrollLeft > elm.clientWidth;

    let verticalScroll = 0;
    let horizontalScroll = 0;

    verticalScroll -= hasScrollTop && distanceTop <= scrollEdgeSize
      ? (1 - distanceTop / scrollEdgeSize) * scrollSpeed : 0;
    verticalScroll += hasScrollBottom && distanceBottom <= scrollEdgeSize
      ? (1 - distanceBottom / scrollEdgeSize) * scrollSpeed : 0;
    horizontalScroll -= hasScrollLeft && distanceLeft <= scrollEdgeSize
      ? (1 - distanceLeft / scrollEdgeSize) * scrollSpeed : 0;
    horizontalScroll += hasScrollRight && distanceRight <= scrollEdgeSize
      ? (1 - distanceRight / scrollEdgeSize) * scrollSpeed : 0;

    if (verticalScroll === 0 && horizontalScroll === 0) {
      scrollWithPointer(pageX, pageY, elm.parentElement);
      return;
    }
    elm.scrollBy(horizontalScroll, verticalScroll);
    clearTimeout(scrollTimeoutIndex);
    scrollTimeoutIndex = setTimeout(() => scrollWithPointer(pageX, pageY, elm), 10);
  }

  
  const moveHandler = ({pageX, pageY}) => {
    moveTo(pageX, pageY);
    draggable.hidden = true;
    let pointedElement = document.elementFromPoint(pageX, pageY);
    draggable.hidden = false;
    clearTimeout(scrollTimeoutIndex);
    scrollTimeoutIndex = setTimeout(() => scrollWithPointer(pageX, pageY, pointedElement), 10);
  };
  

  const preventDefaultDragStart = (e) => {
    e.preventDefault();
    document.removeEventListener('dragstart', preventDefaultDragStart);
  };

  const preventDefaultContextMenu = (e) => {
    e.preventDefault();
  };

  const firstMoveHandler = () => {
    draggable.dispatchEvent(dragStartEvent);
    setDragStyles();
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('contextmenu', preventDefaultContextMenu);
    document.removeEventListener('dragStart', preventDefaultDragStart);
  };

  const onMouseUp = (e) => {
    if (e.button !== 0) return;

    draggable.dispatchEvent(dragEndEvent);
    draggable.hidden = true;
    document.elementFromPoint(e.pageX, e.pageY).dispatchEvent(dropEvent);
    draggable.hidden = false;
    clearTimeout(scrollTimeoutIndex);
    document.removeEventListener('mousemove', firstMoveHandler);
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('contextmenu', preventDefaultContextMenu);
  }

  document.addEventListener('mousemove', firstMoveHandler, {once: true});
  document.addEventListener('dragstart', preventDefaultDragStart);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousemove', moveHandler);
  draggable.classList.add('.in-drag');
};

export const initializeDragAndDrop = () => {
  document.addEventListener('mousedown', mouseDownHandler);
};
