import {extendDialog} from "/js/components/dialog";
import template from "/js/components/date-picker.html";
import Component from "/js/lib/component"
import { htmlToNode } from '/js/lib/utils/dom';
import AirDatePicker from "air-datepicker";
import localeEn from 'air-datepicker/locale/en';
import { endOfDay, addDays} from "date-fns";


class DataPicker extends Component {
  constructor ({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
    });
  }

  init(props) {
    const {
      hasTimepicker = false,
      isTodayShown = false,
      isTomorrowShown = false
    } = props;

    const $datePicker = this.element;
    
    const today = endOfDay(new Date(Date.now()));
    const tomorrow = addDays(today, 1);

    const todayButton = {
      content: "Today",
      className: 'air-datapicker__today-button',
      
      onClick: () => {
        this.emit('submit', today);
        this.parent.close();
      }
    }

    const tomorrowButton = {
      content: "Tomorrow",
      className: 'air-datapicker__today-button',
      
      onClick: () => {
        this.emit('submit', tomorrow);
        this.parent.close();
      }
    }

    const submitButton = {
      content: "Submit",
      className: 'air-datapicker__submit-button',
      
      onClick: (dp) => {
        if (!dp.selectedDates.length) return;

        this.emit('submit', dp.selectedDates[0]);
        this.parent.close();
      }
    }

    const buttons = [submitButton];
    if (isTomorrowShown) {buttons.unshift(tomorrowButton)}
    if (isTodayShown) {buttons.unshift(todayButton)}
    
    this.innerDatePicker = new AirDatePicker($datePicker, {
      timepicker: !!hasTimepicker,
      buttons: buttons,
      locale: localeEn,
      firstDay: 1,
      timeFormat: 'HH:mm',

      onSelect: (date) => {
        this.emit('select', date);
      },
    });

    this.innerDatePicker.selectDate(today, {updateTime: true, selent: true});
  }

  render({}) {

  }

  cleanUp() {
    this.innerDatePicker.destroy();
  }
}

export default extendDialog(DataPicker);