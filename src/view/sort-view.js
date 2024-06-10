import {createElement} from '../render.js';

export default class SortView {

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}

getTemplate() {
  return createTripSortTemplate();
}