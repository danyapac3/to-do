import Component from '/js/lib/component';
import { htmlToNode, showElement, hideElement } from '/js/lib/utils/dom';
import template from './add-item.html';

export default class AddItem extends Component {
  constructor ({parent, props}) {
    super({
      parent,
      props,
      element: htmlToNode(template),
    });
  }

  render(props) {
    const $openFormButton = this.element.querySelector('.add-item__open-form-button');
    const $form = this.element.querySelector('.add-item__form')
    const $textField = this.element.querySelector('.add-item__text-field');
    const $saveButton = this.element.querySelector('.add-item__save-button');
    const $cancelButton = this.element.querySelector('.add-item__cancel-button');

    $openFormButton.addEventListener('click', () => {
      hideElement($openFormButton);
      showElement($form);
      $textField.focus();
      $form.scrollIntoView();
    });

    $textField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      } else if (e.key === ' ' && $textField.textContent.at(-1) === ' ') {
        e.preventDefault();
      }
    });

    $textField.addEventListener('input', (e) => {
      if ($textField.innerHTML === '<br>' || $textField.textContent === ' ') {
        $textField.innerHTML = '';
        return;
      }
      if (e.data && e.data.length > 1) {
        $textField.textContent = $textField.textContent.replace(/\s+/gi, ' ');
      }
    });

    $textField.addEventListener('blur', (e) => {
      if (
        document.activeElement === $textField 
        || e.relatedTarget === $cancelButton
        || e.relatedTarget === $saveButton
        || e.relatedTarget === this.element
      ) {
        return;
      }
      
      hideElement($form);
      showElement($openFormButton);
      const trimmed = $textField.textContent.trim();
      $textField.textContent = '';
      if (trimmed) {
        this.emit('save', {text: trimmed});
      }
    });

    $cancelButton.addEventListener('click', () => {
      $textField.textContent = '';
      hideElement($form);
      showElement($openFormButton);
    });

    $saveButton.addEventListener('click', () => {
      const trimmed = $textField.textContent.trim();
      $textField.textContent = '';
      if (trimmed) {
        this.emit('save', {text: trimmed});
        hideElement($form);
        showElement($openFormButton);
        return;
      }
      $textField.focus();
    });

    $openFormButton.textContent = props.title;
    hideElement($form);
  }
}