import AbstractView from '../framework/view/abstract-view';

function createTripPointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class PointListView extends AbstractView {
  get template() {
    return createTripPointListTemplate();
  }
}
