import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import TripPointModel from './model/trip-point-model.js';
import { mockInit, tripPoints } from './mock/point.js';
import {render} from './framework/render';
import {generateFilter} from './mock/filter';
import ModelOffers from './model/offers-model';
import ModelDestinations from './model/destination-model';
import {offersByType} from './mock/const';
import {destinations} from './mock/destination';

const pageContainer = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
mockInit(5, 10);
const filters = generateFilter();

const tripPointsModel = new TripPointModel(tripPoints);
const modelOffers = new ModelOffers(offersByType);
const modelDestinations = new ModelDestinations(destinations);
const boardPresenter = new BoardPresenter({
  boardContainer: pageContainer,
  tripPointsModel: tripPointsModel,
  modelOffers: modelOffers,
  modelDestinations: modelDestinations
});
render(new FilterView(filters), siteFilterElement);

boardPresenter.init();