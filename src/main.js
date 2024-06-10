import BoardPresenter from './presenter/board-presenter.js';
import TripPointModel from './model/trip-point-model.js';
import { mockInit, tripPoints } from './mock/point.js';
import {render} from './framework/render';
import ModelOffers from './model/offers-model';
import ModelDestinations from './model/destination-model';
import {offersByType} from './mock/const';
import {destinations} from './mock/destination';
import ModelFilters from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonView from './view/new-point-button-view.js';

const pageContainer = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
const placeForButton = document.querySelector('.trip-main');
mockInit(5, 10);

const tripPointsModel = new TripPointModel(tripPoints);
const modelOffers = new ModelOffers(offersByType);
const modelDestinations = new ModelDestinations(destinations);
const modelFilter = new ModelFilters();
const boardPresenter = new BoardPresenter({
  boardContainer: pageContainer,
  tripPointsModel: tripPointsModel,
  modelOffers: modelOffers,
  modelDestinations: modelDestinations,
  modelFilter,
  onNewPointDestroy: handleNewTaskFormClose
});
const filterPresenter = new FilterPresenter({
  filterContainer: siteFilterElement,
  modelFilter,
  tripPointsModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewTaskButtonClick
});

function handleNewTaskFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewTaskButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, placeForButton);

filterPresenter.init();

boardPresenter.init();