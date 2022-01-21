import { select, settings, templates } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();

  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.widgetDate.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.widgetDate.maxDate);

    const params = {
      bookings: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    // console.log('getData params', params);

    const urls = {
      bookings:       settings.db.url + '/' + settings.db.bookings 
                                     + '?' + params.bookings.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events   
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.events   
                                     + '?' + params.eventsRepeat.join('&'),
    }; 
    // console.log('getData urls', urls.eventsCurrent);

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponse){
        const bookingResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse = allResponse[2];
        return Promise.all([
          bookingResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
      });
  } 

  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);

    
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.amountWidgetPeople = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.amountWidgetHours = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.widgetDate = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.widgetHour = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.peopleAmount.addEventListener('update', function(){});
    thisBooking.dom.hoursAmount.addEventListener('update', function(){});
  }
}

export default Booking;