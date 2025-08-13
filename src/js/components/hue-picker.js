import {extendDialog} from "/js/components/dialog";
import Component from "/js/lib/component"
import template from "/js/components/hue-picker.html";
import { htmlToNode } from '/js/lib/utils/dom';

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(value, max));
}

class HuePicker extends Component {

  constructor ({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
    });
  }

  render({hue, onUpdate, onChange}) {
    let currentHue = hue || 0;

    const $picker = this.element;

    const $line = $picker.querySelector('.hue-picker__picker');
    const $thumb = $picker.querySelector('.hue-picker__thumb');

    $thumb.style.backgroundColor = `hsl(${currentHue} 100% 50%)`;

    const setCurrentHue = (pageX) => {
      const {left, width} = $line.getBoundingClientRect();
      const relativeX = clamp(pageX - left, 0, width);
      const relativePercent = relativeX / width;
      currentHue = relativePercent * 360;
      $thumb.style.backgroundColor = `hsl(${currentHue} 100% 50%)`;
      $thumb.style.left = relativeX + 'px';
    }

    const moveHandler = (pageX) => {
      setCurrentHue(pageX);
      onUpdate(currentHue);
    };

    const clickOnLineHandler = ({pageX}) => {
      setCurrentHue(pageX);
      onChange(currentHue);
    };

    const mouseMoveHandler = ({pageX}) => moveHandler(pageX);

    const touchMoveHandler = ({touches}) => moveHandler(touches[0].pageX);

    const upHandler = (e) => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchend', upHandler);
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

    $line.onclick = clickOnLineHandler;
  }
}

export default extendDialog(HuePicker);