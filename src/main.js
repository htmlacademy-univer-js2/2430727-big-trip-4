import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import TripPointModel from './model/trip-point-model.js';
import { mockInit, tripPoints } from './mock/point.js';
import {render} from './framework/render';
import {generateFilter} from './mock/filter';

const pageContainer = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');

mockInit(5, 10);
const filters = generateFilter();
const tripPointsModel = new TripPointModel(tripPoints);
const boardPresenter = new BoardPresenter({boardContainer: pageContainer, tripPointsModel: tripPointsModel});
render(new FilterView(filters), siteFilterElement);

boardPresenter.init();