import {FilterType, FilterTypeDescriptions, UpdateType} from '../mock/const';
import FilterView from '../view/filter-view';
import {render} from '../render';
import {remove, replace} from '../framework/render';


export default class FilterPresenter {
  #filterContainer = null;
  #modelFilter = null;
  #tripPointsModel = null;

  #filterComponent = null;

  constructor({filterContainer, modelFilter, tripPointsModel}) {
    this.#filterContainer = filterContainer;
    this.#modelFilter = modelFilter;
    this.#tripPointsModel = tripPointsModel;

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#modelFilter.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return [FilterType.EVERYTHING, FilterType.FUTURE, FilterType.PAST].map((type) => ({ type, name: FilterTypeDescriptions[type]}));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#modelFilter.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#modelFilter.filter === filterType) {
      return;
    }

    this.#modelFilter.setFilter(UpdateType.MAJOR, filterType);
  };
}