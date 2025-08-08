import ActionModal from "/js/components/action-modal";
import template from "/js/components/hue-picker.html";
import { htmlToNode } from '/js/lib/utils/dom';

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(value, max));
}

export default class HuePicker extends ActionModal {
  render({hue, onUpdate, onChange}) {
    let currentHue = hue || 0;
    const $modal = this.element;
    const $content = $modal.querySelector('.action-modal__content');

    const $picker = htmlToNode(template);
    $content.replaceChildren($picker);

    const $line = $picker.querySelector('.hue-picker__picker');
    const $thumb = $picker.querySelector('.hue-picker__thumb');

    $thumb.style.backgroundColor = `hsl(${currentHue} 100% 50%)`;

    const moveHandler = (pageX) => {
      const {left, width} = $line.getBoundingClientRect();
      const relativeX = clamp(pageX - left, 0, width);
      const relativePercent = relativeX / width;
      currentHue = relativePercent * 360;
      $thumb.style.backgroundColor = `hsl(${currentHue} 100% 50%)`;
      $thumb.style.left = relativeX + 'px';
      onUpdate(currentHue);
    };

    const mouseMoveHandler = ({pageX}) => moveHandler(pageX);

    const touchMoveHandler = ({touches}) => moveHandler(touches[0].pageX);

    const upHandler = (e) => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('mouseup', upHandler);
      e.stopPropagation();
      onChange(currentHue);
    };

    $thumb.onmousedown = (e) => {
      document.addEventListener('mouseup', upHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
      e.preventDefault();
    };

    $thumb.ontouchstart = (e) => {
      document.addEventListener('touchend', upHandler);
      document.addEventListener('touchmove', touchMoveHandler);
    };

    $thumb.oncontextmenu = (e) => {
      e.preventDefault();
    }
  }
}