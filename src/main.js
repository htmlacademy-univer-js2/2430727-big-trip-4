import BoardPresenter from './presenter/board-presenter.js';
import TripPointModel from './model/trip-point-model.js';
import {render} from './framework/render';
import ModelOffers from './model/offers-model';
import ModelDestinations from './model/destination-model';
import ModelFilters from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './points-api-service.js';

const pageContainer = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
const placeForButton = document.querySelector('.trip-main');

const AUTHORIZATION = 'Basic yzbjedfghg1545yzel';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const tripPointModel = new TripPointModel({pointsApiService});
const modelOffers = new ModelOffers({pointsApiService});
const modelDestinations = new ModelDestinations({pointsApiService});
const modelFilters = new ModelFilters();
const boardPresenter = new BoardPresenter({
  boardContainer: pageContainer,
  tripPointsModel: tripPointModel,
  modelOffers: modelOffers,
  modelDestinations: modelDestinations,
  modelFilter: modelFilters,
  onNewPointDestroy: handleNewTaskFormClose
});
const filterPresenter = new FilterPresenter({
  filterContainer: siteFilterElement,
  modelFilter: modelFilters,
  tripPointsModel: tripPointModel
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

filterPresenter.init();
boardPresenter.init();
tripPointModel.init()
  .finally(() => {
    render(newPointButtonComponent, placeForButton);
  });

