import { convertToBasicime, getItemFromItemsById, capitalizeType } from '../utils.js';
import {pointTypes} from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

const TEMPLATE_WAYPOINT = {
  basePrice: 11111,
  dateFrom: '2111-11-11T11:11:11.375Z',
  dateTo: '2122-10-22T22:22:22.375Z',
  destination: undefined,
  id: 0,
  offersIDs: [],
  type: 'taxi',
};

const getTitle = (isEditForm, isDeleting) => {
  if (!isEditForm) {
    return 'Cancel';
  }
  return (isDeleting) ? 'Deleting...' : 'Delete';
};

function createDetinationListTemplate(destinations) {
  return destinations.map((destination) => `
    <option value="${destination.name}"></option>`
  ).join('');
}

function createOffersTemplate(offersIDs, curTypeOffers, id, isDisabled) {
  return curTypeOffers.map((offer) => {
    const isOfferChecked = offersIDs.includes(offer.id) ? 'checked' : '';
    return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${id}" type="checkbox" name="event-offer-${offer.id}" ${isOfferChecked} ${(isDisabled) ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}-${id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');
}

function createImgForDestion(destination) {
  if (!destination) {
    return '';
  }
  return destination.pictures.map((img) => `<img class="event__photo" src="${img.src}" alt="${img.description}">`).join('');
}

function createEventTypeListTemplate(currentType, id) {
  return pointTypes.map((type) => `
  <div class="event__type-item">
    <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${(type === currentType) ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${capitalizeType(type)}</label>
  </div>`
  ).join('');
}

function createEditFormTemplate(isEditForm, onePoint, offers, destinations) {
  const destination = getItemFromItemsById(destinations, onePoint.destination);
  const curTypeOffers = offers.find((element) => element.type === onePoint.type).offers;
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${onePoint.id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${onePoint.type}.png" alt="${onePoint.type}">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${onePoint.id}" type="checkbox" ${(onePoint.isDisabled) ? 'disabled' : ''}>
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeListTemplate(onePoint.type, onePoint.id)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${onePoint.id}">
          ${capitalizeType(onePoint.type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${onePoint.id}" type="text" name="event-destination" value="${(destination) ? destination.name : ''}" list="destination-list-${onePoint.id}" autocomplete="off" ${(onePoint.isDisabled) ? 'disabled' : ''}>
        <datalist id="destination-list-${onePoint.id}">
          ${createDetinationListTemplate(destinations)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${onePoint.id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${onePoint.id}" type="text" name="event-start-time" value="${convertToBasicime(onePoint.dateFrom)}" ${(onePoint.isDisabled) ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-${onePoint.id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${onePoint.id}" type="text" name="event-end-time" value="${convertToBasicime(onePoint.dateFrom)}" ${(onePoint.isDisabled) ? 'disabled' : ''}>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${onePoint.id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${onePoint.id}" type="number" name="event-price" value="${onePoint.basePrice}" autocomplete="off" min="0" max="1111111" ${(onePoint.isDisabled) ? 'disabled' : ''}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${(onePoint.isDisabled) ? 'disabled' : ''}>${(onePoint.isSaving) ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${(onePoint.isDisabled) ? 'disabled' : ''}>${getTitle(isEditForm, onePoint.isDeleting)}</button>
       ${(isEditForm) ? `
       <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
       </button>` :
      ''}
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers ${(curTypeOffers.length === 0) ? 'visually-hidden' : ''}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOffersTemplate(onePoint.offersIDs, curTypeOffers, onePoint.id, onePoint.isDisabled)}
        </div>
      </section>
      <section class="event__section  event__section--destination ${(!destination) ? 'visually-hidden' : ''}">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${(destination) ? destination.description : ''}</p>
         <div class="event__photos-container">
          <div class="event__photos-tape">
          ${createImgForDestion(destination)}
          </div>
        </div>
      </section>
    </section>
  </form>
  </li>`
  );
}

export default class PointEditorView extends AbstractStatefulView {
  #handleRollUp = null;
  #handleSubmit = null;
  #isEditForm = true;

  #fromDatepicker = null;
  #toDatepicker = null;
  #destinations = [];
  #offers = [];
  #handleDeleteClick = null;

  static parsePointToState(point, offers) {
    return {
      ...point,
      curTypeOffers: offers.find((el) => el.type === point.type).offers,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.curTypeOffers;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  constructor({
    onePoint = TEMPLATE_WAYPOINT,
    offers,
    destinations,
    isEditForm = true,
    onSubmit = () => (0),
    onRollUpButton,
    onDeleteClick
  }) {
    super();
    this._setState(PointEditorView.parsePointToState(onePoint, offers));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#isEditForm = isEditForm;
    this.#handleSubmit = onSubmit;
    this.#handleRollUp = onRollUpButton;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  _restoreHandlers() {
    if (this.#isEditForm) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonHandler);
    }
    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    this.#setFromDatePicker();
    this.#setToDatePicker();
  }

  removeElement() {
    super.removeElement();

    if (this.#fromDatepicker) {
      this.#fromDatepicker.destroy();
      this.#fromDatepicker = null;
    }

    if (this.#toDatepicker) {
      this.#toDatepicker.destroy();
      this.#toDatepicker = null;
    }
  }

  reset(point) {
    this.updateElement(
      PointEditorView.parsePointToState(point, this.#offers),
    );
  }

  get template() {
    return createEditFormTemplate(this.#isEditForm, this._state, this.#offers, this.#destinations);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(PointEditorView.parseStateToPoint(this._state));
  };

  #rollUpButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollUp();
  };

  #fromDateChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        dateFrom: userDate.toISOString(),
      });
      this.#toDatepicker.set('minDate', userDate);
    }
  };

  #toDateChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        dateTo: userDate.toISOString(),
      });
    }
  };

  #setFromDatePicker() {
    this.#fromDatepicker = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: convertToBasicime(this._state.dateFrom),
        onChange: this.#fromDateChangeHandler,
      },
    );
  }

  #setToDatePicker() {
    this.#toDatepicker = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: convertToBasicime(this._state.dateTo),
        minDate: convertToBasicime(this._state.dateFrom),
        onChange: this.#toDateChangeHandler,
      },
    );
  }

  #eventTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offersIDs: [],
      curTypeOffers: this.#offers.find((el) => el.type === evt.target.value).offers
    });
  };

  #destinationHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destinations.find((destination) => destination.name === evt.target.value).id,
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #offersHandler = (evt) => {
    evt.preventDefault();
    const clickedOfferId = Number(evt.target.name.split('-').at(-1));
    const newOffersIds = this._state.offersIDs.slice();
    if (newOffersIds.includes(clickedOfferId)) {
      newOffersIds.splice(newOffersIds.indexOf(clickedOfferId), 1);
    } else {
      newOffersIds.push(clickedOfferId);
    }
    this._setState({
      offersIDs: newOffersIds
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditorView.parseStateToPoint(this._state));
  };
}
