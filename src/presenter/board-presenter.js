import SortView from '../view/sort-view';
import PointListView from '../view/point-list-view';
import NoPointsView from '../view/no-points-view';
import {render, RenderPosition} from '../framework/render';
import PointPresenter from '../presenter/point-presenter';
import {SortType} from '../mock/const';
import {sorts} from '../mock/sort';
import {updatePoint} from '../utils';
import PointEditorView from '../view/point-editor-view';

export default class BoardPresenter {
  #noPoints = new NoPointsView();
  #sort = new SortView();
  #pointPresenter = new Map();
  #boardContainer = null;
  #tripPointsModel = null;
  #pointsList = new PointListView();
  #points = null;
  #modelOffers = null;
  #modelDestinations = null;

  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

  #offers = [];
  #destinations = [];

  constructor({boardContainer, tripPointsModel, modelOffers, modelDestinations}) {
    this.#boardContainer = boardContainer;
    this.#tripPointsModel = tripPointsModel;
    this.#modelOffers = modelOffers;
    this.#modelDestinations = modelDestinations;
  }
  init() {
    this.#points = [...this.#tripPointsModel.tripPoints];
    this.#offers = [...this.#modelOffers.offers];
    this.#destinations = [...this.#modelDestinations.destinations];
    this.#renderBoard();
    this.#sourcedPoints = [...this.#tripPointsModel.tripPoints];
  }

  #renderNoPoint() {
    render(this.#noPoints, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    render(this.#sort, this.#boardContainer, RenderPosition.AFTERBEGIN);
    this.#sort.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPointsList() {
    render(this.#pointsList, this.#boardContainer);
    this.#points.forEach((point) => this.#renderPoint(point));
  }
  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointList: this.#pointsList.element,
      offers: this.#offers,
      destinations: this.#destinations,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#renderHandleModeChange,
    });
    pointPresenter.init(point, this.#destinations, this.#offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderHandleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
  
  #renderBoard() {
    if (this.#points.length === 0) {
      render(this.#renderNoPoint, this.#boardContainer);
      return;
    }
    this.#renderSort();
    render(new PointEditorView({
      destinations: this.#destinations,
      offers: this.#offers,
      isEditForm: false
    }), this.#pointsList.element);
    this.#renderPointsList();
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.delete());
    this.#pointPresenter.clear();
  }

  #sortPoints(sortType) {
    if (sorts[sortType]) {
      this.#points.sort(sorts[sortType]);
    } else {
      this.#points = [...this.#sourcedPoints];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointsList();
  };
  #handlePointChange = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offers);
  };
}