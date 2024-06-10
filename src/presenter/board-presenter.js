import SortView from '../view/sort-view';
import PointListView from '../view/point-list-view';
import CreateFormView from '../view/form-creator-view';
import NoPointsView from '../view/no-points-view';
import {render, RenderPosition} from '../framework/render';
import PointPresenter from '../presenter/point-presenter';
import {SortType} from '../mock/const';
import {sorts} from '../mock/sort';

export default class BoardPresenter {
  #noPoints = new NoPointsView();
  #sort = new SortView();
  #pointPresenter = new Map();
  #boardContainer = null;
  #tripPointsModel = null;
  #pointsList = new PointListView();
  #points = null;

  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

  constructor({boardContainer, tripPointsModel}) {
    this.#boardContainer = boardContainer;
    this.#tripPointsModel = tripPointsModel;
  }
  init() {
    this.#points = [...this.#tripPointsModel.tripPoints];
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
    this.#renderPoints();
  }
  #renderPoints() {
    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter({pointList: this.#pointsList.element, onModeChange: this.#renderHandleModeChange});
      pointPresenter.init(point);
      this.#pointPresenter.set(point.id, pointPresenter);
    });
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
    render(new CreateFormView(this.#points[0]), this.#pointsList.element);
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
}